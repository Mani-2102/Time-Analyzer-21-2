# Created on Feb 20, 2025

from flask import Flask, render_template, request, jsonify, send_file
import os

app = Flask(__name__)

# Global variable to track count
count = 0

# Route for home page
@app.route("/")
def home():
    return render_template("index.html")

# Route for analysis page
@app.route("/analysis")
def analysis():
    return render_template("analysis.html")

# API to update count
@app.route("/count", methods=["POST"])
def update_count():
    global count
    count += 1
    return jsonify({"count": count})

# API to export analysis data
@app.route("/export", methods=["POST"])
def export():
    data = request.json
    file_format = data.get("format", "txt")
    content = data.get("content", "")

    # Define file path
    file_name = f"analysis_report.{file_format}"
    file_path = os.path.join(os.getcwd(), file_name)

    try:
        # Generate the file based on format
        if file_format == "txt":
            with open(file_path, "w") as file:
                file.write(content)
        elif file_format == "pdf":
            from fpdf import FPDF
            pdf = FPDF()
            pdf.add_page()
            pdf.set_font("Arial", size=12)
            pdf.multi_cell(0, 10, content)
            pdf.output(file_path)
        elif file_format == "docx":
            from docx import Document
            doc = Document()
            doc.add_paragraph(content)
            doc.save(file_path)
        else:
            return jsonify({"error": "Invalid file format"}), 400

        # Return file for download
        return send_file(file_path, as_attachment=True)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
