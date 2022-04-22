from flask import Flask, render_template
import os
import sys
from datetime import datetime
ts = int('1284101485')

print()
app = Flask(__name__)

ADMIN_PASTES = os.path.join(os.getcwd(), "data", "admin")


def bytes2KB(value: int):
    return value / 1000


@app.route("/")
def index():
    admin_posts_list = []
    admin_posts_file_list = os.listdir(ADMIN_PASTES)
    for admin_post_file_name in admin_posts_file_list:
        admin_post_file_name_path = os.path.join(
            ADMIN_PASTES, admin_post_file_name)
        admin_post_file_name_stats = os.stat(admin_post_file_name_path)
        admin_posts_list.append(
            {
                "name": admin_post_file_name,
                "size": bytes2KB(admin_post_file_name_stats.st_size),
                "creation": datetime.utcfromtimestamp(int(admin_post_file_name_stats.st_mtime)).strftime('%d-%m-%Y')
            }
        )

    return render_template("index.html", admin_posts_list=admin_posts_list)


@app.route("/")
def all_links():
    return "All Links"


if __name__ == "__main__":
    app.run("0.0.0.0", port=8080, debug=False)
