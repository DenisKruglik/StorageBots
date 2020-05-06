export const Config = {
    CANVAS_WIDTH: 1024,
    CANVAS_HEIGHT: 768,
    CELL_SIDE_LENGTH: 75,
    CELL_COLOR: 0xfbdd5d,
    CELL_BORDER_COLOR: 0xffffff,
    CELL_BORDER_SIZE: 1,
    DEFAULT_STORAGE_OBJECT_OFFSET: 5,
    TEXTURES: [
        {
            name: 'robot',
            url: '/media/robot.png'
        },
        {
            name: 'crate',
            url: '/media/crate.png'
        },
    ],
    ROBOTS_SPEED: 5,
    LOADING_SPEED: 0.02,
    LOADER_RADIUS: 30,
    LOADER_OFFSET: 10,
};

export default Config;
