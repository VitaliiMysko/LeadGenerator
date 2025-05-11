from flask import Flask, request, jsonify

app = Flask(__name__)

FILE_PATH = "received_data.tsv"

@app.route('/data', methods=['POST'])
def handle_data():
    try:
        data = request.get_json()

        email = data.get('email')
        input_data = data.get('data')

        if not email or not input_data:
            return jsonify({"error": "Missing 'email' or 'data' in request body"}), 400

        print(f"Received data: {input_data}")

        file_path = FILE_PATH

        if is_duplicate(file_path, input_data):
            print("Duplicate data detected. Data not saved.")
            return jsonify({"error": "Duplicate data detected. Data not saved."}), 409

        with open(file_path, "a") as file:
            file.write(f"{input_data}\n")

        return jsonify({"message": "Data received successfully!"}), 200

    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return jsonify({"error": "An internal server error occurred"}), 500

        
def is_duplicate(file_path, input_data):
    try:
        with open(file_path, "r") as file:
            for line in file:
                if input_data in line:
                    print("find duplicate")
                    return True
        return False
    except FileNotFoundError:
        return False


@app.route('/row_count', methods=['GET'])
def get_row_count():
    try:
        row_count = count_rows_in_file(FILE_PATH)

        return jsonify({"row_count": row_count}), 200

    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return jsonify({"error": "An internal server error occurred"}), 500
    
def count_rows_in_file(file_path):
    try:
        with open(file_path, "r") as file:
            return sum(1 for _ in file)  # Count non-empty lines
    except FileNotFoundError:
        return 0


if __name__ == '__main__':
    print("Starting server on http://localhost:3000")
    app.run(host='127.0.0.1', port=3000, debug=True)