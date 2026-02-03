# 乳腺癌复发预测模型

基于随机生存森林（Random Survival Forest）算法的乳腺癌复发风险预测工具。

## 项目简介

这是一个纯前端的医学预测模型，使用随机生存森林算法预测乳腺癌患者的复发风险。模型基于GBSG2数据集训练，包含686例患者数据，C-index达到0.730。

## 特点

- ✅ 纯前端运行，无需后端服务器
- ✅ 模型文件仅2.65KB，加载快速
- ✅ 基于真实临床数据训练
- ✅ 提供风险分数和风险分层
- ✅ 适合部署到GitHub Pages

## 模型信息

- **算法**: 随机生存森林（5棵树）
- **数据集**: GBSG2乳腺癌数据集
- **样本数**: 686例
- **事件数**: 299例
- **C-index**: 0.730
- **特征数**: 7个

## 输入特征

1. **年龄** (age): 患者年龄（岁）
2. **肿瘤大小** (tsize): 肿瘤最大直径（mm）
3. **阳性淋巴结数量** (pnodes): 检测到的阳性淋巴结数量
4. **孕激素受体** (progrec): 孕激素受体水平（fmol/l）
5. **雌激素受体** (estrec): 雌激素受体水平（fmol/l）
6. **激素治疗** (horTh): 是否接受激素治疗（是/否）
7. **肿瘤分级** (tgrade): 肿瘤病理分级（I/II/III级）

## 使用方法

### 在线访问

直接访问GitHub Pages部署的网站：
```
https://dukejob.github.io/test_rsf/
```

### 本地运行

1. 克隆仓库：
```bash
git clone https://github.com/dukejob/test_rsf.git
cd test_rsf
```

2. 使用任意HTTP服务器运行（因为需要加载JSON文件）：
```bash
# 使用Python
python -m http.server 8000

# 或使用Node.js
npx http-server
```

3. 在浏览器中打开 `http://localhost:8000`

### 测试数据示例

您可以使用以下示例数据进行测试：

**示例1 - 低风险患者**
- 年龄: 45
- 肿瘤大小: 15 mm
- 阳性淋巴结: 0
- 孕激素受体: 50 fmol/l
- 雌激素受体: 100 fmol/l
- 激素治疗: 是
- 肿瘤分级: I级

**示例2 - 高风险患者**
- 年龄: 65
- 肿瘤大小: 45 mm
- 阳性淋巴结: 8
- 孕激素受体: 5 fmol/l
- 雌激素受体: 10 fmol/l
- 激素治疗: 否
- 肿瘤分级: III级

## 项目结构

```
test_rsf/
├── index.html              # 主页面
├── css/
│   └── style.css          # 样式文件
├── js/
│   ├── rsf-predictor.js   # RSF预测器核心逻辑
│   └── main.js            # 主逻辑和表单处理
├── data/
│   └── rsf_model.json     # 训练好的模型文件（2.65KB）
├── train_model.py         # 模型训练脚本
└── README.md              # 项目说明
```

## 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **UI框架**: Bootstrap 4.6
- **依赖库**: jQuery 3.6
- **机器学习**: scikit-survival (Python, 仅用于训练)

## 重新训练模型

如果需要重新训练模型或使用自己的数据：

1. 安装依赖：
```bash
pip install scikit-survival numpy pandas
```

2. 运行训练脚本：
```bash
python train_model.py
```

3. 模型将保存到 `data/rsf_model.json`

## 注意事项

⚠️ **重要提示**：
- 本模型仅供医疗专业人员参考使用
- 不应作为临床决策的唯一依据
- 模型基于特定数据集训练，可能不适用于所有人群
- 使用前请咨询专业医生

## 许可证

本项目仅用于教育和研究目的。

## 参考文献

- GBSG2数据集来源: German Breast Cancer Study Group
- Random Survival Forest: Ishwaran et al. (2008)
