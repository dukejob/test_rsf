"""
训练简化的随机生存森林模型用于乳腺癌复发预测
使用scikit-survival库和GBSG2数据集
"""

import json
import numpy as np
from sksurv.datasets import load_gbsg2
from sksurv.ensemble import RandomSurvivalForest
from sklearn.model_selection import train_test_split

# 加载乳腺癌数据集（GBSG2）
X, y = load_gbsg2()

# 选择关键特征
feature_names = ['age', 'tsize', 'pnodes', 'progrec', 'estrec', 'horTh', 'tgrade']
X_selected = X[feature_names]

# 处理分类变量
X_selected['horTh'] = X_selected['horTh'].map({'no': 0, 'yes': 1})
X_selected['tgrade'] = X_selected['tgrade'].map({'I': 1, 'II': 2, 'III': 3})

print("数据集信息:")
print(f"样本数: {len(X_selected)}")
print(f"特征: {feature_names}")
print(f"事件数: {y['cens'].sum()}")

# 训练简化的RSF模型（只用5棵树，便于前端运行）
print("\n训练RSF模型...")
rsf = RandomSurvivalForest(
    n_estimators=5,  # 只用5棵树
    max_depth=4,     # 限制深度
    min_samples_split=20,
    min_samples_leaf=10,
    random_state=42
)

rsf.fit(X_selected, y)
print("模型训练完成!")

# 计算C-index评估模型性能
from sksurv.metrics import concordance_index_censored
risk_scores = rsf.predict(X_selected)
c_index = concordance_index_censored(y['cens'], y['time'], risk_scores)[0]
print(f"C-index: {c_index:.3f}")

# 导出模型为JSON格式
print("\n导出模型为JSON...")

def export_tree_to_dict(tree):
    """将决策树导出为字典"""
    tree_dict = {
        'children_left': tree.children_left.tolist(),
        'children_right': tree.children_right.tolist(),
        'feature': tree.feature.tolist(),
        'threshold': tree.threshold.tolist(),
        'n_node_samples': tree.n_node_samples.tolist(),
    }
    return tree_dict

# 导出所有树
trees_data = []
for i, estimator in enumerate(rsf.estimators_):
    tree_data = export_tree_to_dict(estimator.tree_)
    trees_data.append(tree_data)
    print(f"导出第 {i+1} 棵树")

# 计算风险分数的统计信息（用于前端风险分层）
all_risk_scores = rsf.predict(X_selected)
risk_percentiles = {
    'p25': float(np.percentile(all_risk_scores, 25)),
    'p50': float(np.percentile(all_risk_scores, 50)),
    'p75': float(np.percentile(all_risk_scores, 75))
}

# 构建完整的模型JSON
model_json = {
    'feature_names': feature_names,
    'n_estimators': len(trees_data),
    'trees': trees_data,
    'risk_percentiles': risk_percentiles,
    'c_index': float(c_index)
}

# 保存为JSON文件
output_path = 'data/rsf_model.json'
with open(output_path, 'w') as f:
    json.dump(model_json, f, indent=2)

print(f"\n模型已保存到: {output_path}")
print(f"模型大小: {len(json.dumps(model_json)) / 1024:.2f} KB")
