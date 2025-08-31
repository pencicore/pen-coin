import oss2
import json
import os
import config

# ========== 配置部分 ==========
# 阿里云 OSS 配置信息
ACCESS_KEY_ID = config.ACCESS_KEY_ID
ACCESS_KEY_SECRET = config.ACCESS_KEY_SECRET
ENDPOINT = config.ENDPOINT
BUCKET_NAME = config.BUCKET_NAME

# 本地 NFT 资源目录
IMAGE_DIR = ".input/nft_avater"  # NFT 图片文件夹
METADATA_DIR = ".output/metadata"  # JSON 文件输出目录
BASE_URL = f"https://{BUCKET_NAME}.oss-cn-chengdu.aliyuncs.com"

# ========== 初始化 OSS ==========
auth = oss2.Auth(ACCESS_KEY_ID, ACCESS_KEY_SECRET)
bucket = oss2.Bucket(auth, ENDPOINT, BUCKET_NAME)

# 确保 metadata 文件夹存在
os.makedirs(METADATA_DIR, exist_ok=True)

# ========== 生成 & 上传 ==========
def generate_metadata(token_id, image_url):
    """生成 NFT Metadata JSON"""
    metadata = {
        "name": f"My NFT #{token_id}",
        "description": f"这是第 {token_id} 个 NFT, 更多描述正在更新中...",
        "image": image_url,
        "attributes": [
            {"trait_type": "编号", "value": str(token_id)},
            {"trait_type": "稀有度", "value": "普通" if token_id % 13 != 0 else "稀有"}
        ]
    }
    return metadata


def main():
    # 遍历本地图片文件夹
    for idx, filename in enumerate(sorted(os.listdir(IMAGE_DIR)), start=1):
        if not filename.lower().endswith((".png", ".jpg", ".jpeg", ".gif")):
            continue

        local_path = os.path.join(IMAGE_DIR, filename)
        remote_path = f"nft/images/{filename}"  # 上传到 OSS 的路径

        # 上传图片到 OSS
        bucket.put_object_from_file(remote_path, local_path)
        image_url = f"{BASE_URL}/{remote_path}"
        print(f"✅ 上传图片: {image_url}")

        # 生成 Metadata JSON
        metadata = generate_metadata(idx, image_url)
        json_filename = f"{idx}.json"
        local_json_path = os.path.join(METADATA_DIR, json_filename)

        with open(local_json_path, "w", encoding="utf-8") as f:
            json.dump(metadata, f, ensure_ascii=False, indent=2)

        # 上传 Metadata JSON 到 OSS
        remote_json_path = f"nft/metadata/{json_filename}"
        bucket.put_object_from_file(remote_json_path, local_json_path)
        json_url = f"{BASE_URL}/{remote_json_path}"
        print(f"✅ 上传Metadata: {json_url}")


if __name__ == "__main__":
    main()
