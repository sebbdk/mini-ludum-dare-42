game.resources = [

	//title image
	{name:'title_screen', type:'image', src:'data/img/gui/title_screen.png'},

	/**
	 * Graphics
	 */
	{name:'area01_level_tiles', type:'image', src:'data/img/maps/area01_level_tiles.png'},
	// the main player spritesheet
	{name: "gripe_run_right", type:"image", src: "data/img/sprites/gripe_run_right.png"},
	{name: "area01_bkg0",         type:"image", src: "data/img/area01_bkg0.png"},
	{name: "area01_bkg1",         type:"image", src: "data/img/area01_bkg1.png"},

    // the spinning coin spritesheet
    {name: "spinning_coin_gold",  type:"image", src: "data/img/sprites/spinning_coin_gold.png"},
    // our enemty entity
    {name: "wheelie_right",       type:"image", src: "data/img/sprites/wheelie_right.png"},
// game font
{
    name: "32x32_font",
    type: "image",
    src: "data/img/font/32x32_font.png"
},

	/* 
     * Maps. 
     */
	{name: "area00", type: "tmx", src: "data/map/area00.tmx"},
	{name: "area01", type: "tmx", src: "data/map/area01.tmx"},


/* 
     * Background music. 
     */
    {name: "dst-inertexponent", type: "audio", src: "data/bgm/", channel : 1},
     
    /* 
     * Sound effects. 
     */
    {name: "cling", type: "audio", src: "data/sfx/", channel : 2},
    {name: "stomp", type: "audio", src: "data/sfx/", channel : 1},
    {name: "jump",  type: "audio", src: "data/sfx/", channel : 1}

];
