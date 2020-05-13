export const Config = {
    CANVAS_WIDTH: 1024,
    CANVAS_HEIGHT: 768,
    CELL_SIDE_LENGTH: 45,
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
        fieldWidth: 20,
        fieldHeight: 20,
        targetCells: [
            { x: 3, y: 19 },
            { x: 4, y: 19 },
            { x: 5, y: 19 },
            { x: 6, y: 19 },
            { x: 7, y: 19 },
            { x: 8, y: 19 },
            { x: 9, y: 19 },
            { x: 10, y: 19 },
            { x: 11, y: 19 },
            { x: 12, y: 19 },
            { x: 13, y: 19 },
            { x: 14, y: 19 },
            { x: 15, y: 19 },
            { x: 16, y: 19 },
        ],
        robots: [
            { x: 3, y: 19 },
            { x: 4, y: 19 },
            { x: 5, y: 19 },
            { x: 6, y: 19 },
            { x: 7, y: 19 },
            { x: 8, y: 19 },
            { x: 9, y: 19 },
            { x: 10, y: 19 },
            { x: 11, y: 19 },
            { x: 12, y: 19 },
            { x: 13, y: 19 },
            { x: 14, y: 19 },
            { x: 15, y: 19 },
            { x: 16, y: 19 },
        ],
    },
    MAP: [["crate","down","up","crate","crate","down","up","crate","crate","down","up","crate","crate","down","up","crate","crate","down","up","crate"],["crate","down","up","crate","crate","down","up","crate","crate","down","up","crate","crate","down","up","crate","crate","down","up","crate"],["crate","down","up","crate","crate","down","up","crate","crate","down","up","crate","crate","down","up","crate","crate","down","up","crate"],["crate","down","up","crate","crate","down","up","crate","crate","down","up","crate","crate","down","up","crate","crate","down","up","crate"],["crate","down","up","crate","crate","down","up","crate","crate","down","up","crate","crate","down","up","crate","crate","down","up","crate"],["crate","down","up","crate","crate","down","up","crate","crate","down","up","crate","crate","down","up","crate","crate","down","up","crate"],["crate","down","up","crate","crate","down","up","crate","crate","down","up","crate","crate","down","up","crate","crate","down","up","crate"],["crate","down","up","crate","crate","down","up","crate","crate","down","up","crate","crate","down","up","crate","crate","down","up","crate"],["crate","down","up","crate","crate","down","up","crate","crate","down","up","crate","crate","down","up","crate","crate","down","up","crate"],["crate","down","up","crate","crate","down","up","crate","crate","down","up","crate","crate","down","up","crate","crate","down","up","crate"],["crate","down","up","crate","crate","down","up","crate","crate","down","up","crate","crate","down","up","crate","crate","down","up","crate"],["crate","down","up","crate","crate","down","up","crate","crate","down","up","crate","crate","down","up","crate","crate","down","up","crate"],["crate","down","up","crate","crate","down","up","crate","crate","down","up","crate","crate","down","up","crate","crate","down","up","crate"],["crate","down","up","crate","crate","down","up","crate","crate","down","up","crate","crate","down","up","crate","crate","down","up","crate"],["crate","down","up","crate","crate","down","up","crate","crate","down","up","crate","crate","down","up","crate","crate","down","up","crate"],["crate","down","up","crate","crate","down","up","crate","crate","down","up","crate","crate","down","up","crate","crate","down","up","crate"],["crate","down","up","crate","crate","down","up","crate","crate","down","up","crate","crate","down","up","crate","crate","down","up","crate"],["crate","down","up","crate","crate","down","up","crate","crate","down","up","crate","crate","down","up","crate","crate","down","up","crate"],["crate","left","left","left","left","left","left","left","left","left","left","left","left","left","left","left","left","left","left","crate"],["crate","right","right","right","right","right","right","right","right","right","right","right","right","right","right","right","right","right","right","crate"]],
};

export default Config;
