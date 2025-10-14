#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const TARGET_WIDTH = 1200;
const TARGET_HEIGHT = 630;

async function createThumbnail(inputPath, outputPath) {
  try {
    // 이미지 정보 가져오기
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    console.log(`원본 이미지: ${metadata.width}x${metadata.height}`);

    // 높이를 630으로 맞추기
    const resizedWidth = Math.round((metadata.width * TARGET_HEIGHT) / metadata.height);
    const resized = await image
      .resize({ height: TARGET_HEIGHT })
      .toBuffer();

    console.log(`리사이즈: ${resizedWidth}x${TARGET_HEIGHT}`);

    if (resizedWidth >= TARGET_WIDTH) {
      // 이미 충분히 넓으면 crop
      await sharp(resized)
        .resize(TARGET_WIDTH, TARGET_HEIGHT, { fit: 'cover' })
        .toFile(outputPath);
      console.log(`완료: ${outputPath} (crop)`);
    } else {
      // 좌우 확장 필요
      const extendLeft = Math.floor((TARGET_WIDTH - resizedWidth) / 2);
      const extendRight = TARGET_WIDTH - resizedWidth - extendLeft;

      // 가장자리 색상 샘플링 (왼쪽/오른쪽 10픽셀 영역의 평균)
      const resizedImage = sharp(resized);
      const { data, info } = await resizedImage.raw().toBuffer({ resolveWithObject: true });

      const sampleWidth = Math.min(10, Math.floor(info.width / 4)); // 최대 10px, 이미지가 작으면 비율에 맞게

      // 왼쪽 가장자리 색상 (왼쪽 sampleWidth 픽셀의 평균)
      let leftR = 0, leftG = 0, leftB = 0;
      let leftCount = 0;
      for (let y = 0; y < info.height; y++) {
        for (let x = 0; x < sampleWidth; x++) {
          const offset = (y * info.width + x) * info.channels;
          leftR += data[offset];
          leftG += data[offset + 1];
          leftB += data[offset + 2];
          leftCount++;
        }
      }
      leftR = Math.round(leftR / leftCount);
      leftG = Math.round(leftG / leftCount);
      leftB = Math.round(leftB / leftCount);

      // 오른쪽 가장자리 색상 (오른쪽 sampleWidth 픽셀의 평균)
      let rightR = 0, rightG = 0, rightB = 0;
      let rightCount = 0;
      for (let y = 0; y < info.height; y++) {
        for (let x = info.width - sampleWidth; x < info.width; x++) {
          const offset = (y * info.width + x) * info.channels;
          rightR += data[offset];
          rightG += data[offset + 1];
          rightB += data[offset + 2];
          rightCount++;
        }
      }
      rightR = Math.round(rightR / rightCount);
      rightG = Math.round(rightG / rightCount);
      rightB = Math.round(rightB / rightCount);

      console.log(`왼쪽 색상: rgb(${leftR}, ${leftG}, ${leftB})`);
      console.log(`오른쪽 색상: rgb(${rightR}, ${rightG}, ${rightB})`);

      // 좌우 각각의 색상으로 확장
      // 1. 왼쪽 확장
      const leftExtended = await sharp(resized)
        .extend({
          top: 0,
          bottom: 0,
          left: extendLeft,
          right: 0,
          background: { r: leftR, g: leftG, b: leftB }
        })
        .toBuffer();

      // 2. 오른쪽 확장
      await sharp(leftExtended)
        .extend({
          top: 0,
          bottom: 0,
          left: 0,
          right: extendRight,
          background: { r: rightR, g: rightG, b: rightB }
        })
        .toFile(outputPath);

      console.log(`완료: ${outputPath} (확장: 좌${extendLeft}px, 우${extendRight}px)`);
    }
  } catch (error) {
    console.error('에러:', error.message);
    process.exit(1);
  }
}

// CLI 사용법
const args = process.argv.slice(2);
if (args.length < 1) {
  console.log('사용법: node scripts/create-thumbnail.js <입력이미지> [출력이미지]');
  console.log('예시: node scripts/create-thumbnail.js ~/Downloads/image.png public/assets/images/thumbnail.png');
  process.exit(1);
}

const inputPath = args[0];
const outputPath = args[1] || inputPath.replace(/\.(png|jpg|jpeg)$/i, '-thumbnail.png');

if (!fs.existsSync(inputPath)) {
  console.error(`파일을 찾을 수 없습니다: ${inputPath}`);
  process.exit(1);
}

createThumbnail(inputPath, outputPath);
