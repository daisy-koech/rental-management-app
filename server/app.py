from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db, migrate, bcrypt


def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    CORS(app)

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)

    @app.route("/")
    def home():
        return {"message": "Welcome!"}, 200

    return app


app = create_app()


if __name__ == "__main__":
    app.run(debug=True)

