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
        {
            name: 'finish',
            url: '/media/finish.png'
        },
    ],
    ROBOTS_SPEED: 5,
    LOADING_SPEED: 0.02,
    LOADER_RADIUS: 30,
    LOADER_OFFSET: 10,
    INIT_DATA: {
        fieldWidth: 10,
        fieldHeight: 10,
        targetCells: [
            { x: 0, y: 4 },
            { x: 6, y: 9 },
            { x: 8, y: 5 },
        ],
        robots: [
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 3, y: 1 },
            { x: 4, y: 1 },
            { x: 5, y: 1 },
        ],
        crates: [
            { x: 0, y: 1 },
            { x: 2, y: 7 },
            { x: 8, y: 9 },
            { x: 6, y: 1 },
            { x: 2, y: 4 },
            { x: 5, y: 5 },
            { x: 6, y: 3 },
            { x: 0, y: 0 },
            { x: 9, y: 1 },
            { x: 4, y: 0 },
        ]
    }
};

export default Config;
