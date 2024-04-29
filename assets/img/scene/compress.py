import os
from PIL import Image

def compress_and_resize_images(folder_path, quality=90, resize_percentage=90):
    for filename in os.listdir(folder_path):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            file_path = os.path.join(folder_path, filename)
            img = Image.open(file_path)

            # 计算新尺寸
            new_width = int(img.width * resize_percentage / 100)
            new_height = int(img.height * resize_percentage / 100)

            # 调整尺寸
            img_resized = img.resize((new_width, new_height), Image.ANTIALIAS)

            # 检查是否为RGBA模式，如果是则转换
            if img_resized.mode == 'RGBA':
                img_resized = img_resized.convert('RGB')

            # 原始文件重命名
            # original_path = os.path.join(folder_path, filename.split('.')[0] + '_original.' + filename.split('.')[-1])
            # os.rename(file_path, original_path)

            # 设置压缩质量并保存图片
            img_resized.save(file_path, 'JPEG', quality=quality, optimize=True)

# 使用当前目录
current_folder = os.getcwd()
compress_and_resize_images(current_folder)
