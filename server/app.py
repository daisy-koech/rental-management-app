from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db, migrate, bcrypt
from routes import register_routes


def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    CORS(app, supports_credentials=True, origins=["https://rental-management-kenya.vercel.app"])

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)

    register_routes(app)

    @app.route("/")
    def home():
        return {"message": "Welcome!"}, 200

    return app

app = create_app()


if __name__ == "__main__":
    app.run(debug=True)

