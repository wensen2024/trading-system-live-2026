const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/<footer[\s\S]*?<\/footer>/, `<footer className="border-t border-gray-800 mt-8 py-6 text-center">
        <div className="text-gray-600 text-xs space-y-1">
          <p className="font-bold text-gray-500">⚠️ 投资风险声明</p>
          <p>本系统仅供学习研究使用，不构成任何投资建议。股市有风险，投资需谨慎。</p>
          <p>数据来源：东方财富、新浪财经、同花顺、港交所等权威机构，实时抓取仅供参考。</p>
          <p className="pt-2 text-yellow-500/80 font-bold tracking-widest text-[13px]">由“盈指量杭州科技有限公司”设计出品</p>
        </div>
      </footer>`);
fs.writeFileSync('src/App.tsx', code, 'utf8');