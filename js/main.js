/**
 * 主逻辑文件
 * 处理表单提交和结果显示
 */

// 创建预测器实例
const predictor = new RSFPredictor();

// 页面加载时初始化
$(document).ready(async function() {
    console.log('页面加载完成，开始加载模型...');

    // 加载模型
    const loaded = await predictor.loadModel();

    if (!loaded) {
        alert('模型加载失败，请刷新页面重试');
        return;
    }

    console.log('模型加载成功，可以开始预测');

    // 处理表单提交
    $('#predictionForm').on('submit', function(e) {
        e.preventDefault();

        // 收集表单数据
        const patientData = {
            age: $('#age').val(),
            tsize: $('#tsize').val(),
            pnodes: $('#pnodes').val(),
            progrec: $('#progrec').val(),
            estrec: $('#estrec').val(),
            horTh: $('input[name="horTh"]:checked').val(),
            tgrade: $('input[name="tgrade"]:checked').val()
        };

        console.log('患者数据:', patientData);

        try {
            // 进行预测
            const result = predictor.predict(patientData);
            console.log('预测结果:', result);

            // 显示结果
            displayResults(result);
        } catch (error) {
            console.error('预测失败:', error);
            alert('预测失败: ' + error.message);
        }
    });
});

/**
 * 显示预测结果
 */
function displayResults(result) {
    $('#riskScore').text(result.riskScore);
    $('#riskGroup').text(result.riskGroup);

    // 根据风险等级设置颜色
    const riskGroupElement = $('#riskGroup');
    riskGroupElement.removeClass('text-success text-warning text-danger');

    if (result.riskGroup === '低风险') {
        riskGroupElement.addClass('text-success');
    } else if (result.riskGroup === '中风险') {
        riskGroupElement.addClass('text-warning');
    } else {
        riskGroupElement.addClass('text-danger');
    }

    // 显示结果区域
    $('#results').slideDown();

    // 滚动到结果区域
    $('html, body').animate({
        scrollTop: $('#results').offset().top - 20
    }, 500);
}
