import codecs
with codecs.open("D:/OrbeSystems/inho_frontend/lint_out.txt", "r", "utf-16le", errors="ignore") as f1:
    content = f1.read()
with codecs.open("D:/OrbeSystems/inho_frontend/lint_utf8.txt", "w", "utf-8") as f2:
    f2.write(content)
