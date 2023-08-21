export const switchRankedTier = (tier) => {
    switch (tier) {
        case 'IRON':
            return ('坚韧黑铁');

        case 'BRONZE':
            return ('英勇黄铜');

        case 'SILVER':
            return ('不屈白银');

        case 'GOLD':
            return ('荣耀黄金');

        case 'EMERALD':
            return ('流光翡翠');

        case 'PLATINUM':
            return ('华贵铂金');

        case 'DIAMOND':
            return ('璀璨钻石');

        case 'MASTER':
            return ('超凡大师');

        case 'GRANDMASTER':
            return ('傲视宗师');

        case 'CHALLENGER':
            return ('最强王者');


        default:
            return ('');
    }
}