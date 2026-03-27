# International Tax Website - Project Status

## 项目概述
国际税务查询网站，支持查询各国税率、预提税率和批量对比功能。

## 网站地址
- **Netlify (完整功能)**: https://international-tax.netlify.app/
- **GitHub Pages (静态版)**: https://i1212mee.github.io/international-tax-website/

## GitHub仓库
https://github.com/i1212mee/international-tax-website

---

## ✅ 已完成功能

### 1. 国家税率查询 (National Tax Rates)
- [x] VAT/GST/SST自动识别显示（根据国家显示正确税种名称）
- [x] 多档位税率展示（如中国VAT 13%/9%/6%/3%/0%）
- [x] 企业所得税 (CIT) 查询
- [x] 个人所得税 (PIT) 查询
- [x] 国家输入自动匹配功能
- [x] 后端API尝试爬取PwC实时数据
- [x] 提供官方税务局链接

### 2. 预提税查询 (Withholding Tax)
- [x] 单次查询：Payer国家 → Payee国家
- [x] 批量查询：一个国家 → 多个国家
- [x] **批量查询方向切换**：一个Payer对多个Payees OR 多个Payers对一个Payee
- [x] 双向对比功能：同时显示正向和反向税率
- [x] 税率差异计算
- [x] 后端API返回PwC等权威数据源链接

### 3. 历史记录和收藏
- [x] 历史查询记录（最近50条）
- [x] 收藏功能
- [x] 快速重新执行历史查询

### 4. 国家覆盖
- [x] 150+国家和地区
- [x] 包含中国、香港、澳门、台湾
- [x] 覆盖全球80%以上国家

### 5. 数据准确性改进
- [x] 香港WHT数据修正（利息不征WHT）
- [x] HK-SG条约限制说明（只覆盖航运空运）
- [x] 马来西亚SST税率更新（2025年最新）
- [x] 印尼VAT税率更新（12%，实际有效11%）
- [x] 国家匹配逻辑修复（Indonesia不再匹配到India）

---

## 📁 文件结构

```
tax-website/
├── index.html          # 主页面
├── styles.css          # 样式文件
├── countries.js        # 国家列表（150+国家）
├── tax-data.js         # 税率数据库
├── app.js              # 主要逻辑
├── netlify/
│   └── functions/
│       └── search.js   # 后端API（爬取PwC等）
├── PROJECT_STATUS.md   # 项目状态（本文件）
├── DATA_UPDATE_GUIDE.md # 数据更新指南
└── push-*.bat          # 各种推送脚本
```

---

## ⚠️ 已知问题

### 1. 实时搜索功能
- **状态**: 部分工作
- **说明**: 后端会请求PwC网站，但HTML解析不稳定
- **解决方案**: 优先显示本地数据库数据，提供官方链接让用户核实

### 2. 数据准确性
- **状态**: 需要定期更新
- **说明**: 税率数据可能过时
- **解决方案**: 每周手动更新数据库（用户找我说"更新税务数据库"）

### 3. 条约限制说明
- **状态**: 已添加部分
- **说明**: 如HK-SG条约只覆盖航运空运
- **需要**: 继续补充其他条约的限制说明

---

## 📋 待办事项

### 高优先级
- [ ] 继续改进PwC页面解析逻辑
- [ ] 补充更多国家的WHT条约限制说明
- [ ] 验证并更新主要国家税率数据

### 中优先级
- [ ] 添加更多国家的官方税务局链接
- [ ] 改进错误处理和用户提示
- [ ] 添加数据来源更新时间显示

### 低优先级
- [ ] 移动端响应式优化
- [ ] 导出查询结果为PDF/Excel
- [ ] 多语言支持

---

## 🔄 最近修改 (2026-03-26)

1. **批量查询方向切换**
   - 新增：一个Payer → 多个Payees
   - 新增：多个Payers → 一个Payee
   - UI切换开关

2. **国家匹配修复**
   - 修复：Indonesia不再错误匹配到India
   - 改进：按国家名长度排序匹配

3. **税率数据更新**
   - 马来西亚SST: 6%/8% Service Tax, 5%/10% Sales Tax
   - 印尼VAT: 12% (名义), 11% (实际有效)

4. **双向对比UI改进**
   - 添加绿色/蓝色颜色区分
   - 添加差异计算列

---

## 🚀 部署说明

### 推送更新到GitHub
双击运行任意 `push-*.bat` 文件，或手动执行：
```cmd
cd /d d:\CodeFuse\claude-test-project\tax-website
git add .
git commit -m "Your commit message"
git push
```

### Netlify自动部署
GitHub推送后，Netlify会自动检测并部署（1-2分钟）

### 手动部署到Netlify
1. 访问 https://app.netlify.com/
2. 点击站点 → Deploys → Trigger deploy

---

## 📞 数据更新合作模式

```
用户每周找我："请帮我更新税务数据库"
    ↓
我搜索最新税率变化
    ↓
更新 tax-data.js 文件
    ↓
推送到 GitHub/Netlify
    ↓
网站自动更新
```

---

## 📚 数据来源

### 主要来源
- PwC Tax Summaries: https://taxsummaries.pwc.com/
- OECD Tax Database: https://www.oecd.org/tax/
- KPMG Tax Rates: https://home.kpmg/taxrates

### 官方税务局
- 中国国家税务总局
- 香港税务局 IRD
- 新加坡税务局 IRAS
- 美国IRS
- 等等...

---

*最后更新: 2026-03-26*