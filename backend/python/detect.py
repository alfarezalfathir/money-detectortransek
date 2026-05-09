import cv2
import numpy as np
import sys

# =========================
# LOAD IMAGE
# =========================

image_path = sys.argv[1]

img = cv2.imread(image_path)

if img is None:
    print("PALSU")
    sys.exit()

img = cv2.resize(img, (500, 250))

gray1 = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# =========================
# ORB
# =========================

orb = cv2.ORB_create()

kp1, des1 = orb.detectAndCompute(gray1, None)

# =========================
# TEMPLATE
# =========================

templates = [
    {
        "name": "1000",
        "path": "templates/1000f.jpeg"
    },
    {
        "name": "2000",
        "path": "templates/2000f.jpeg"
    },
    {
        "name": "10000",
        "path": "templates/10000f.jpeg"
    }
]

best_score = 0
best_money = "UNKNOWN"

# =========================
# MATCHING
# =========================

for item in templates:

    template = cv2.imread(item["path"])

    if template is None:
        continue

    template = cv2.resize(template, (500, 250))

    gray2 = cv2.cvtColor(template, cv2.COLOR_BGR2GRAY)

    kp2, des2 = orb.detectAndCompute(gray2, None)

    if des1 is None or des2 is None:
        continue

    bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)

    matches = bf.match(des1, des2)

    matches = sorted(matches, key=lambda x: x.distance)

    score = len(matches)

    print(item["name"], score)

    if score > best_score:
        best_score = score
        best_money = item["name"]

# =========================
# RESULT
# =========================

print("BEST:", best_score)

if best_score > 80:

    print(f"ASLI - Rp {best_money}")

else:

    print("PALSU")