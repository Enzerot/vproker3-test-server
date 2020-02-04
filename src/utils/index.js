export const getRegion = passport => {
    const seriesRegionMatches = {
        79: 1,
        84: 2,
        80: 3,
        81: 4,
        82: 5,
        26: 6,
        83: 7,
        85: 8,
        91: 9,
        86: 10,
        87: 11,
        88: 12,
        89: 13,
        98: 14,
        90: 15,
        92: 16,
        93: 17,
        94: 18,
        95: 19,
        96: 20,
        97: 21,
        1: 22,
        3: 23,
        4: 24,
        5: 25,
        7: 26,
        8: 27,
        11: 29,
        12: 30,
        14: 31,
        15: 32,
        17: 33,
        19: 35,
        20: 36,
        24: 37,
        25: 38,
        27: 39,
        29: 40,
        20: 41,
        32: 42,
        33: 43,
        34: 44,
        37: 45,
        38: 46,
        41: 47,
        42: 48,
        44: 49,
        46: 50,
        47: 51,
        22: 52,
        49: 53,
        50: 54,
        52: 55,
        53: 56,
        54: 57,
        56: 58,
        57: 59,
        58: 60,
        60: 61,
        61: 62,
        36: 63,
        63: 64,
        64: 65,
        65: 66,
        66: 67,
        68: 68,
        28: 69,
        69: 70,
        73: 73,
        75: 74,
        76: 75,
        78: 76,
        45: 77,
        40: 78,
        99: 79,
        43: 80,
        48: 81,
        51: 82,
        55: 83,
        59: 84,
        62: 85,
        67: 86,
        77: 87,
        72: 88,
        74: 89,
    }

    return seriesRegionMatches[parseInt(passport.slice(0, 2))]
}

export const getMonth = (num) => {
    switch (num) {
        case 0: return 'Января'
        case 1: return 'Февраля'
        case 2: return 'Марта'
        case 3: return 'Апреля'
        case 4: return 'Мая'
        case 5: return 'Июня'
        case 6: return 'Июля'
        case 7: return 'Августа'
        case 8: return 'Сентября'
        case 9: return 'Октября'
        case 10: return 'Ноября'
        case 11: return 'Декабря'
        default: throw new Error('unknown month')
    }
}