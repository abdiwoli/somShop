// getImage.js
const importAll = (r) => {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
};

// Import all images from the `images` directory
const images = importAll(require.context('../../uploads/', false, /\.(png|jpg|jpeg)$/));

export const getImage = (filename) => {
    return images[filename] || null;
};
