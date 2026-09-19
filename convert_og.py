import os
from PIL import Image

src_path = r'e:\변사범님\2. 실습 자료\Part 3\portfolio_new\video_\muel_muel_Vertical_916_brand_launch_key_visual_MUELMU_Open_numb_11fe1d95-b4c5-4bf4-bb5f-c650008ffdb0.png'
dest_path = r'e:\변사범님\2. 실습 자료\Part 3\portfolio_new\og_image.jpg'

if os.path.exists(src_path):
    img = Image.open(src_path)
    img = img.convert('RGB')
    # Resize to standard OG Image size (1200x630 or similar aspect ratio if needed, but let's just scale it down to max 1200 width)
    img.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
    img.save(dest_path, 'JPEG', quality=85)
    print("Image converted successfully.")
else:
    print("Source image not found.")
