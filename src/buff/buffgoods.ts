export interface BuffData {
    fop_str: string;
    goods_infos: { [key: string]: GoodsInfo };
    items: Item[];
}
export interface GoodsInfo {
    appid: number;
    description: null;
    can_inspect: boolean;
    goods_id: number;
    icon_url: string;
    is_charm: boolean;
    item_id: null;
    keychain_color_img: null;
    market_hash_name: string;
    market_min_price: string;
    name: string;
    original_icon_url: string;
    sell_min_price: string;
    sell_reference_price: string;
    short_name: string;
    steam_price: string;
    steam_price_cny: string;
    tags: { [key: string]: Tag };
}
export interface Tag {
    category: string;
    id?: number;
    internal_name: string;
    localized_name: string;
}
export interface Item {
    allow_bargain: boolean;
    allow_bargain_chat: boolean;
    appid: number;
    asset_info: AssetInfo;
    background_image_url: string;
    can_use_inspect_trn_url: boolean;
    coupon_infos: null;
    created_at: number;
    description: string;
    featured: number;
    fee: string;
    goods_id: number;
    id: string;
    img_src: string;
    income: string;
    lowest_bargain_price: string;
    mode: number;
    order_type: number;
    price: string;
    recent_average_duration: null;
    recent_deliver_rate: null;
    sticker_premium: number | null;
    tradable_cooldown: null;
    updated_at: number;
    user_id: string;
    user_steamid: string;
}
export interface AssetInfo {
    action_link: string;
    appid: number;
    assetid: string;
    classid: string;
    contextid: number;
    goods_id: number;
    has_tradable_cooldown: boolean;
    id: string;
    info: Info;
    instanceid: string;
    paintwear: string;
    tradable_cooldown_text: string;
    tradable_unfrozen_time: null;
}
export interface Sticker {
    category: string;
    img_url: string;
    name: string;
    sell_reference_price: string;
    slot: number;
    sticker_id: number;
    wear: number;
    offset_x?: number;
    offset_y?: number;
    rotation?: number;
}
export interface Info {
    fraudwarnings: null | string;
    icon_url: string;
    inspect_mobile_url: string;
    inspect_preview_url: string;
    inspect_state: number;
    inspect_url: string;
    keychains: Keychain[];
    original_icon_url: string;
    paintindex: number;
    paintseed: number;
    stickers: Sticker[];
    tournament_tags: Tag[];
    metaphysic?: Metaphysic;
    phase_data?: PhaseDataClass;
    tier_data?: PhaseDataClass;
}
export interface Metaphysic {
    data: PhaseDataClass;
    title: string;
}

export interface PhaseDataClass {
    color: string;
    name: string;
}
export interface Keychain {
    goods_id: number;
    img_url: string;
    name: string;
    pattern: number;
    pattern_color: string;
    sell_reference_price: string;
    slot: number;
    sticker_id: number;
}