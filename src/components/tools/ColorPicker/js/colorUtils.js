// 将 HSV 转换为 RGB
export function hsvToRgb(h, s, v) {
    // 容错处理：如果参数是 NaN，默认返回黑色
    h = isNaN(h) ? 0 : h / 360;
    s = isNaN(s) ? 0 : s / 100;
    v = isNaN(v) ? 0 : v / 100;

    let r, g, b, i = Math.floor(h * 6), f = h * 6 - i;
    let p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// RGB 转 Hex
export function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

// Hex 转 RGB
export function hexToRgb(hex) {
    // 去掉开头的 #
    let s = hex.replace(/^#/, '');

    // 处理 3 位简写: f00 -> ff0000
    if (s.length === 3) {
        s = s.split('').map(c => c + c).join('');
    }

    // 必须是 6 位才进行解析
    if (s.length !== 6) return null;

    const val = parseInt(s, 16);
    // 如果解析结果不是数字（比如输入了 #ghj），返回 null
    if (isNaN(val)) return null;

    return [
        (val >> 16) & 255,
        (val >> 8) & 255,
        val & 255
    ];
}

// RGB 转 HSV (用于输入 Hex 后更新 UI 坐标)
export function rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;
    const d = max - min;
    s = max === 0 ? 0 : d / max;
    if (max === min) {
        h = 0;
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h * 360, s * 100, v * 100];
}

// 计算相对亮度 (Relative Luminance)
function getLuminance(r, g, b) {
    const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// 计算对比度
export function getContrast(rgb1, rgb2) {
    const l1 = getLuminance(...rgb1) + 0.05;
    const l2 = getLuminance(...rgb2) + 0.05;
    return (Math.max(l1, l2) / Math.min(l1, l2)).toFixed(3);
}
