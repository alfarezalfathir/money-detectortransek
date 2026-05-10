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

# resize kamera
img = cv2.resize(img, (640, 480))

# =========================
# CROP AREA TENGAH
# =========================

h, w = img.shape[:2]

crop = img[
    int(h * 0.25):int(h * 0.75),
    int(w * 0.1):int(w * 0.9)
]

crop = cv2.resize(crop, (600, 300))

# =========================
# PREPROCESS
# =========================

gray1 = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)

# contrast
gray1 = cv2.equalizeHist(gray1)

# blur dikit
gray1 = cv2.GaussianBlur(gray1, (3, 3), 0)

# edge
gray1 = cv2.Canny(gray1, 100, 200)

# =========================
# ORB
# =========================

orb = cv2.ORB_create(
    nfeatures=10000
)

kp1, des1 = orb.detectAndCompute(gray1, None)

if des1 is None:
    print("PALSU")
    sys.exit()

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

bf = cv2.BFMatcher(cv2.NORM_HAMMING)

# =========================
# LOOP TEMPLATE
# =========================

for item in templates:

    template = cv2.imread(item["path"])

    if template is None:
        continue

    template = cv2.resize(template, (600, 300))

    gray2 = cv2.cvtColor(template, cv2.COLOR_BGR2GRAY)

    gray2 = cv2.equalizeHist(gray2)

    gray2 = cv2.GaussianBlur(gray2, (3, 3), 0)

    gray2 = cv2.Canny(gray2, 100, 200)

    kp2, des2 = orb.detectAndCompute(gray2, None)

    if des2 is None:
        continue

    matches = bf.knnMatch(des1, des2, k=2)

    good = []

    for pair in matches:

        if len(pair) < 2:
            continue

        m, n = pair

        if m.distance < 0.8 * n.distance:
            good.append(m)

    score = len(good)

    print(item["name"], score)

    if score > best_score:
        best_score = score
        best_money = item["name"]

# =========================
# RESULT
# =========================

print("BEST:", best_score)

if best_score >= 10:
    print(f"ASLI - Rp {best_money}")
else:
    print("PALSU")