const { ccclass, property } = cc._decorator;

@ccclass
export default class SkuCounter extends cc.Component {
    @property(cc.Label)
    skuLabel: cc.Label = null;

    private skuCount: { [key: string]: number } = {};
    private tempSkuCount: { [key: string]: number } = {};

    onLoad() {
        if (!this.skuLabel) {
            cc.error('SkuCounter: skuLabel is not assigned!');
        }
        this.loadSkuCount();
        this.updateLabel();
    }

    /**
     * Increases the SKU count for the given type.
     * @param {string} type - The type of SKU to increase.
     */
    increaseSkuCount(type: string) {
        if (!this.tempSkuCount[type]) {
            this.tempSkuCount[type] = 0;
        }
        this.tempSkuCount[type]++;
        this.updateLabel();
    }

    /**
     * Saves the temporary SKU count to the main SKU count and stores it in local storage.
     */
    saveSkuCount() {
        for (let key in this.tempSkuCount) {
            if (!this.skuCount[key]) {
                this.skuCount[key] = 0;
            }
            this.skuCount[key] += this.tempSkuCount[key];
        }
        this.tempSkuCount = {};
        cc.sys.localStorage.setItem('skuCount', JSON.stringify(this.skuCount));
        this.updateLabel();
    }

    /**
     * Resets the temporary SKU count.
     */
    resetSkuCount() {
        this.tempSkuCount = {};
        this.updateLabel();
    }

    /**
     * Updates the SKU label with the current SKU count.
     */
    private updateLabel() {
        this.skuLabel.string = `${this.skuCount['Bonus'] || 0 + this.tempSkuCount['Bonus'] || 0}`;
    }

    /**
     * Loads the SKU count from local storage.
     */
    private loadSkuCount() {
        const savedSkuCount = cc.sys.localStorage.getItem('skuCount');
        if (savedSkuCount) {
            this.skuCount = JSON.parse(savedSkuCount);
        } else {
            this.skuCount = {};
        }
    }
}
