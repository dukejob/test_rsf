/**
 * 随机生存森林预测器
 * 用于加载模型并进行预测
 */

class RSFPredictor {
    constructor() {
        this.model = null;
        this.isLoaded = false;
    }

    /**
     * 加载模型JSON文件
     */
    async loadModel(modelPath = 'data/rsf_model.json') {
        try {
            const response = await fetch(modelPath);
            this.model = await response.json();
            this.isLoaded = true;
            console.log('模型加载成功:', this.model);
            return true;
        } catch (error) {
            console.error('模型加载失败:', error);
            return false;
        }
    }

    /**
     * 遍历单棵决策树进行预测
     */
    predictTree(tree, features) {
        let nodeId = 0;

        // 遍历树直到叶子节点
        while (tree.children_left[nodeId] !== -1) {
            const featureIdx = tree.feature[nodeId];
            const threshold = tree.threshold[nodeId];

            if (features[featureIdx] <= threshold) {
                nodeId = tree.children_left[nodeId];
            } else {
                nodeId = tree.children_right[nodeId];
            }
        }

        // 返回叶子节点的样本数（用于计算风险）
        return tree.n_node_samples[nodeId];
    }

    /**
     * 使用RSF模型进行预测
     */
    predict(patientData) {
        if (!this.isLoaded) {
            throw new Error('模型尚未加载');
        }

        // 将患者数据转换为特征数组（按模型特征顺序）
        const features = this.model.feature_names.map(name => parseFloat(patientData[name]));

        // 对所有树进行预测并平均
        let predictions = [];
        for (let tree of this.model.trees) {
            predictions.push(this.predictTree(tree, features));
        }

        // 计算平均风险分数（归一化）
        const avgPrediction = predictions.reduce((a, b) => a + b, 0) / predictions.length;
        const riskScore = avgPrediction / 100; // 简单归一化

        // 风险分层
        const riskGroup = this.getRiskGroup(riskScore);

        return {
            riskScore: riskScore.toFixed(3),
            riskGroup: riskGroup
        };
    }

    /**
     * 根据风险分数确定风险分层
     */
    getRiskGroup(riskScore) {
        const percentiles = this.model.risk_percentiles;

        if (riskScore < percentiles.p25) {
            return '低风险';
        } else if (riskScore < percentiles.p75) {
            return '中风险';
        } else {
            return '高风险';
        }
    }
}
