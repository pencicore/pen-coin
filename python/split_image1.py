from PIL import Image
import os


def split_image(image_path, save_dir, tile_width=16, tile_height=16):
    # 打开图片
    img = Image.open(image_path)
    img_width, img_height = img.size

    # 确保输出目录存在
    os.makedirs(save_dir, exist_ok=True)

    # 遍历切割
    count = 0
    for row in range(0, img_height, tile_height):
        for col in range(0, img_width, tile_width):
            # 切割区域 (left, upper, right, lower)
            box = (col, row, col + tile_width, row + tile_height)
            tile = img.crop(box)

            # 保存小图
            # tile.save(os.path.join(save_dir, f"tile_{row // tile_height}_{col // tile_width}.png"))
            tile.save(os.path.join(save_dir, f"{count+1}.png"))
            count += 1

    print(f"切割完成，共生成 {count} 张小图片。")


# 使用示例
split_image(".input/素材2.png", ".input/nft_avater")
