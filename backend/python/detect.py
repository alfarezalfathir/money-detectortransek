import cv2
import numpy as np
import sys

# =========================
# LOAD IMAGE FILE
# =========================

image_path = sys.argv[1]

img = cv2.imread(image_path)

if img is None:
    print("PALSU")
    sys.exit()

# resize
img = cv2.resize(img, (300, 150))

# grayscale
img_gray = cv2.cvtColor(
    img,
    cv2.COLOR_BGR2GRAY
)

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

best_match = 0
best_money = "UNKNOWN"

# =========================
# MATCHING
# =========================

for item in templates:

    template = cv2.imread(item["path"])

    if template is None:
        print("Template not found:", item["path"])
        continue

    template = cv2.resize(template, (300, 150))

    template_gray = cv2.cvtColor(
        template,
        cv2.COLOR_BGR2GRAY
    )

    result = cv2.matchTemplate(
        img_gray,
        template_gray,
        cv2.TM_CCOEFF_NORMED
    )

    min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)

    print(item["name"], max_val)

    if max_val > best_match:
        best_match = max_val
        best_money = item["name"]

# =========================
# RESULT
# =========================

print("BEST:", best_match)

if best_match > 0.20:

    print(f"ASLI - Rp {best_money}")

else:

    print("PALSU")