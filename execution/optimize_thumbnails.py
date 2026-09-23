import os
import shutil
from PIL import Image

thumb_dir = 'assets/thumbnails'
backup_dir = '.tmp/thumbnails_backup'
os.makedirs(backup_dir, exist_ok=True)

print('=== OPTIMIZING THUMBNAILS ===')
files = [f for f in os.listdir(thumb_dir) if f.endswith('.webp')]

total_before = 0
total_after = 0

for f in files:
    src_path = os.path.join(thumb_dir, f)
    bak_path = os.path.join(backup_dir, f)
    
    # Backup original if not already backed up
    if not os.path.exists(bak_path):
        shutil.copy2(src_path, bak_path)
        
    size_before = os.path.getsize(src_path)
    total_before += size_before
    
    im = Image.open(bak_path)
    # Target 1600x1280 (3x Retina display density for 540x432 container)
    new_size = (1600, 1280)
    resized = im.resize(new_size, Image.Resampling.LANCZOS)
    
    # Save optimized WebP with sharp quality
    resized.save(src_path, 'WEBP', quality=85, method=6)
    
    size_after = os.path.getsize(src_path)
    total_after += size_after
    print(f'{f}: {size_before/1024:.1f} KB -> {size_after/1024:.1f} KB (-{(1 - size_after/size_before)*100:.1f}%)')

print(f'\nTotal: {total_before/(1024*1024):.2f} MB -> {total_after/(1024*1024):.2f} MB (-{(1 - total_after/total_before)*100:.1f}%)')
