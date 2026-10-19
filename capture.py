import os
import subprocess

with open("D:/OrbeSystems/inho_frontend/build_log.txt", "w", encoding="utf-8") as f:
    subprocess.run("npm run build", shell=True, cwd="D:/OrbeSystems/inho_frontend", stdout=f, stderr=subprocess.STDOUT)
