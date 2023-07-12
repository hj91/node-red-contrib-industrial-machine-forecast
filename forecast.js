/**

 forecast.js - Copyright 2023 Harshad Joshi and Bufferstack.IO Analytics Technology LLP, Pune

 Licensed under the GNU General Public License, Version 3.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 https://www.gnu.org/licenses/gpl-3.0.html

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

 **/

module.exports = function(RED) {
    function ForecastNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.machine = config.machine || "machine"; // Add machine name and details here
        node.parameter = config.parameter; // Parameters defination that are to be logged or displayed
        node.alpha = config.alpha || 0.5; // Exponential smoothing factor
        node.numStdDevs = config.numStdDevs || 2; // Number of standard deviations for the threshold
        node.adaptive = config.adaptive || false; // Adaptive mode flag
        node.lastValue = null;
        node.variance = 0;
        node.mean = 0;
        node.n = 0;
        node.on('input', function(msg) {
            var current = Number(msg.payload);
            var machine = node.machine;
            var parameter = node.parameter;
            node.n++;
            if (node.lastValue === null) {
                node.lastValue = current;
                node.mean = current;
                msg.payload = {
                    machine: machine,
                    parameter: parameter,
                    value: current,
                    status: "Normal"
                };
                node.status({fill:"green", shape:"dot", text:"Normal"});
            } else {
                var prediction = node.alpha * current + (1 - node.alpha) * node.lastValue;
                var predictionError = current - prediction;
                var absPredictionError = Math.abs(predictionError);
                node.variance = node.alpha * Math.pow(predictionError, 2) + (1 - node.alpha) * node.variance;
                node.lastValue = prediction;
                node.mean = node.mean + (current - node.mean) / node.n;

                // If adaptive mode is on, adjust alpha based on the prediction error
                if (node.adaptive) {
                    node.alpha = Math.min(Math.max(absPredictionError / (node.mean || 1), 0.01), 1);
                }

                // Flag the value as an anomaly if it is outside the threshold
                if (absPredictionError > node.numStdDevs * Math.sqrt(node.variance)) {
                    var anomalyType = predictionError > 0 ? "Sudden Spike" : "Sudden Drop";
                    msg.payload = {
                        machine: machine,
                        parameter: parameter,
                        value: current,
                        status: "Anomaly - " + anomalyType
                    };
                    node.status({fill:"red", shape:"ring", text:"Anomaly - " + anomalyType});
                } else {
                    msg.payload = {
                        machine: machine,
                        parameter: parameter,
                        value: current,
                        status: "Normal"
                    };
                    node.status({fill:"green", shape:"dot", text:"Normal"});
                }
            }
            node.send(msg);
        });
    }
    RED.nodes.registerType("forecast",ForecastNode);
}

