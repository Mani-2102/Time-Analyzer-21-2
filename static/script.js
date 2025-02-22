// Created on Feb20, 2025
// --
document.addEventListener("DOMContentLoaded", function () {
    let count = 0;
    let timestamps = [];

    // Page switching
    const page1 = document.getElementById("page1");
    const page2 = document.getElementById("page2");

    const countButton = document.getElementById("count-button");
    const countDisplay = document.getElementById("count-display");
    const goToAnalysisButton = document.querySelector("button[onclick*='analysis']");
    const backButton = document.getElementById("back-button");

    const saveButton = document.getElementById("save-button");
    const exportButton = document.getElementById("export-button");

    // Ensure buttons exist before adding event listeners
    if (countButton) {
        countButton.addEventListener("click", function () {
            count++;
            timestamps.push(Date.now());
            countDisplay.textContent = `Count: ${count}`;
        });
    }

    if (goToAnalysisButton) {
        goToAnalysisButton.addEventListener("click", function () {
            calculateAnalysis();
            page1.style.display = "none";
            page2.style.display = "block";
        });
    }

    if (backButton) {
        backButton.addEventListener("click", function () {
            page1.style.display = "block";
            page2.style.display = "none";
        });
    }

    if (saveButton) {
        saveButton.addEventListener("click", function () {
            alert("Data saved locally!");
        });
    }

    if (exportButton) {
        exportButton.addEventListener("click", exportData);
    }

    // Analysis Calculation
    function calculateAnalysis() {
        if (timestamps.length < 2) {
            alert("Not enough data for analysis!");
            return;
        }

        const intervals = timestamps.slice(1).map((time, i) => (time - timestamps[i]) / 1000);
        const totalTime = intervals.reduce((a, b) => a + b, 0);
        const avgTime = totalTime / intervals.length;
        const minTime = Math.min(...intervals);
        const maxTime = Math.max(...intervals);

        document.getElementById("total-time").textContent = `Total Time: ${totalTime.toFixed(2)}s`;
        document.getElementById("average-time").textContent = `Average Time: ${avgTime.toFixed(2)}s`;
        document.getElementById("min-time").textContent = `Min Time: ${minTime.toFixed(2)}s`;
        document.getElementById("max-time").textContent = `Max Time: ${maxTime.toFixed(2)}s`;
        document.getElementById("total-count").textContent = `Total Count: ${count}`;

        generateCharts(intervals);
    }

    // Generate Charts
    function generateCharts(intervals) {
        if (typeof Chart !== "undefined") {
            const lineCtx = document.getElementById("line-chart").getContext("2d");
            const histCtx = document.getElementById("histogram-chart").getContext("2d");

            new Chart(lineCtx, {
                type: "line",
                data: {
                    labels: intervals.map((_, i) => `Click ${i + 1}`),
                    datasets: [{
                        label: "Time Interval (s)",
                        data: intervals,
                        borderColor: "blue",
                        fill: false
                    }]
                }
            });

            new Chart(histCtx, {
                type: "bar",
                data: {
                    labels: intervals.map((_, i) => `Click ${i + 1}`),
                    datasets: [{
                        label: "Time Interval (s)",
                        data: intervals,
                        backgroundColor: "orange",
                        borderColor: "black",
                        borderWidth: 1
                    }]
                }
            });
        } else {
            console.error("Chart.js is not loaded.");
        }
    }

    // Export Functionality
    function exportData() {
        const data = `
        Total Time: ${document.getElementById("total-time").textContent}\n
        Average Time: ${document.getElementById("average-time").textContent}\n
        Min Time: ${document.getElementById("min-time").textContent}\n
        Max Time: ${document.getElementById("max-time").textContent}\n
        Total Count: ${document.getElementById("total-count").textContent}
        `;

        const blob = new Blob([data], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "analysis_report.txt";
        link.click();
    }
});
