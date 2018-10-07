exports.upload_controller = (req, res, next) => {
    if (req.file) {
        return res.json({ result: 'ok', file: req.file, image_url: req.file.path.replace('public', '')});
    } else {
        return res.status(400).send('req.file is '+req.file);
    }
}