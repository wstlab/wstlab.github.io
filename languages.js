const languages = {
  zh: {
    nav: {
      logo: "QuickForm",
      logoSub: "AI原生数据平台",
      links: [
        { text: "痛点", href: "#problem" },
        { text: "使用指南", href: "#solution" },
        { text: "工作原理", href: "#principle" },
        { text: "应用案例", href: "#cases" },
        { text: "版本", href: "#versions" },
        { text: "故事", href: "#story" }
      ],
      cta: "访问平台 →"
    },
    hero: {
      badge: "AI原生教育工具 · 开源免费 · 四步极简上手",
      title: "QuickForm",
      subtitle: "让大模型生成的交互网页<br>也能回收数据",
      slogan: "努力打通AI赋能教育的\"最后一公里\"",
      actions: {
        primary: "开始使用 QuickForm →",
        secondary: "📖 查看文档"
      },
      stats: {
        schools: "学校单位",
        users: "注册教师",
        tasks: "数据任务",
        submissions: "回收数据"
      }
    },
    problem: {
      label: "问题",
      heading: "交互网页虽然精彩<br>但数据却是一座座\"孤岛\"",
      desc: "教师借助 DeepSeek、GPT 等大模型可以快速生成课堂点名工具、单词连连看、物理实验模拟等精美交互网页。然而，学生的每一次点击、每一个选择，这些有价值的数据都停留在本地，无法自动汇聚到教师手中。",
      islands: [
        { icon: "🎯", name: "课堂点名", data: "32条数据", status: "⚠ 无法回收" },
        { icon: "🔤", name: "单词连连看", data: "128条数据", status: "⚠ 无法回收" },
        { icon: "⚗️", name: "化学实验", data: "67条数据", status: "⚠ 无法回收" },
        { icon: "📊", name: "在线测验", data: "256条数据", status: "⚠ 无法回收" },
        { icon: "🔬", name: "物理模拟", data: "89条数据", status: "⚠ 无法回收" },
        { icon: "📝", name: "互动问答", data: "45条数据", status: "⚠ 无法回收" }
      ],
      cards: [
        { icon: "🏝️", title: "数据孤岛", desc: "每个AI生成的交互网页都是独立的\"数据孤岛\"，学生在前端的操作数据停留在本地浏览器，教师无法了解学生的真实使用情况。" },
        { icon: "🚧", title: "技术门槛过高", desc: "要实现数据回收，通常需要教师具备后端开发能力，自行搭建服务器和数据库。这对大多数一线教师而言门槛过高。" },
        { icon: "📉", title: "无法教学分析", desc: "即使\"单词连连看\"再好玩，教师也没有办法知道哪些人在玩这个程序、哪些单词的错误率比较高，难以开展有效的教学优化。" }
      ]
    },
    solution: {
      label: "解决方案",
      heading: "四步极简体验",
      desc: "QuickForm 本身不生成网页，但提供了数据接口，能够把任何网页的数据汇总起来。只需四步，即可完成从数据收集到智能分析的全流程。",
      steps: [
        { num: "01", icon: "📮", title: "生成表单地址", desc: "注册 QuickForm 账号，创建一个\"数据任务\"，系统自动生成专属的 API 接口地址——您的\"数字收件箱\"。" },
        { num: "02", icon: "🤖", title: "生成交互网页", desc: "用您熟悉的大模型生成网页，只需在提示词中加入一句话：", prompt: "请将数据以表单形式提交至<br>https://quickform.cn/api/..." },
        { num: "03", icon: "📋", title: "收集与查看数据", desc: "学生提交数据后，在 QuickForm 实时查看所有提交记录，支持逐条查看或批量导出为 Excel 表格。" },
        { num: "04", icon: "📊", title: "生成智能报告", desc: "一键生成 AI 智能分析报告，包含提交人数、平均分、错误分布、高频问题等可视化内容，快速把握教学重难点。" }
      ]
    },
    principle: {
      label: "工作原理",
      heading: "用 AI 解决 AI 的问题",
      text: {
        title: "基于标准表单技术",
        p1: "QuickForm 提供了写入（POST）和读出（GET）的数据接口。任何网页只需将表单的 <code>action</code> 属性指向 QuickForm 端点，数据就会自动分类保存。",
        p2: "因为表单技术非常成熟，所有大模型都能正确理解并生成对应代码——教师只需在提示词中加一句话。",
        quote: "数据不需要严格规范，因为大模型能分析'凌乱'的数据。用户不用了解数据类型和 SQL，只要能描述需求，AI 就能帮你完成后续分析。",
        p3: "这一设计理念继承了图灵\"用机器打败机器\"的思想——用 AI 编写工具、用 AI 采集数据、再用 AI 分析数据，每一个环节都与 AI 相关。"
      }
    },
    capabilities: {
      label: "能力边界",
      heading: "不止是表单回收",
      desc: "同一个 API 地址，既能写入也能读出，由此衍生出多种交互模式。",
      cards: [
        { icon: "📝", title: "经典应用", desc: "将数据用 POST 方式提交到 QuickForm，覆盖问卷回收、在线考试、课堂签到等常见需求。", tags: ["问卷调查", "在线考试", "课堂签到"] },
        { icon: "📡", title: "交互分析", desc: "用网页 A 提交数据，再做一个网页 B 实时读取并分析，构建数据看板、数据驾驶舱与大屏展示。", tags: ["数据看板", "驾驶舱", "大屏展示"] },
        { icon: "💬", title: "即时互动", desc: "在同一个网页上边提交数据、边读取数据，实现聊天室、留言板、弹幕墙等即时交互功能。", tags: ["聊天室", "留言板", "弹幕墙"] }
      ]
    },
    cases: {
      label: "应用案例",
      heading: "全国教师正在使用",
      desc: "来自全国各地的教师在课堂教学、创意教学和真实问题解决中广泛应用 QuickForm。",
      cards: [
        { emoji: "🏫", title: "常规课堂数据收集", desc: "将交互网页嵌入日常教学，高效收集课堂练习、测验和反馈数据。", items: ["课堂即时练习与检测", "学生签到与课堂参与度统计", "为回收数据编写实时展示大屏"] },
        { emoji: "🎮", title: "创意教学应用", desc: "借助 AI 生成的游戏化、模拟化交互网页，激发学生兴趣并采集行为数据。", items: ["游戏化教学互动", "仿真实验数据采集", "学习行为过程分析"] },
        { emoji: "🌍", title: "真实问题解决", desc: "支撑跨学科学习项目和教学管理场景，让数据驱动教学决策。", items: ["学生跨学科学习项目", "教师教学管理优化", "温州科技高中案例精选"] }
      ]
    },
    versions: {
      label: "版本介绍",
      heading: "选择适合您的版本",
      desc: "QuickForm 分为两个版本，面向不同使用场景，均可免费使用。",
      cards: [
        { badge: "开源", title: "教师版", desc: "面向个人教师，在局域网内为班级学生提供数据收集服务。", features: ["完全开源，自由修改", "单用户模式，简洁高效", "运行在教师本地电脑上", "内置 Python 环境", "绿色软件，解压即用", "局域网内数据收集"] },
        { badge: "免费", title: "校园版", desc: "面向学校和机构，部署在互联网上，支持多用户协作。", features: ["签署合作协议后免费使用", "部署在互联网上", "支持多用户、多角色", "更完善的安全机制", "官方维护与技术支持", "持续更新与功能迭代"] }
      ]
    },
    story: {
      label: "QuickForm 的故事",
      heading: "一个周六，一段对话<br>一个 AI 原生项目的诞生",
      timeline: [
        { date: "2024 年底", title: "问题浮现", desc: "DeepSeek 发布后，教师们纷纷用大模型写\"课堂点名\"\"单词连连看\"等交互网页。谢作如敏锐地发现：这些网页只是静态的，数据无法流通。" },
        { date: "2025 年初", title: "思考与探索", desc: "谢作如在《中国信息技术教育》发表《借助大模型设计交互式课件》，开始寻找解决方案，期望教育企业能开发数据流通工具。" },
        { date: "2025 年 11 月 1 日", title: "QuickForm 诞生", desc: "一个周六的晚上，谢作如打开 Trae（字节跳动编程工具），输入了一段需求描述。两天时间，QuickForm 原型诞生。名字也是 AI 取的。" },
        { date: "2025 年 11 月", title: "团队组建与公测", desc: "方建文（温州大学）和林淼焱迅速加入。林淼焱第二天就把 QuickForm 部署上线。一周后正式公测。" },
        { date: "一个月内", title: "广泛传播", desc: "仅靠一篇公众号文章，注册用户接近 1000 名，用户来自全国各地的一线教师。" }
      ],
      highlight: {
        title: "AI 原生项目",
        p1: "有人问，开发 QuickForm 花了多少时间？原型编写只花了两天。在维护过程中，团队从未\"手搓\"过代码。",
        p2: "用 AI 解决 AI 编程带来的新问题，用 AI 采集到的数据再借助 AI 进行分析——每一个环节都与 AI 有关。",
        p3: "这不再是传统的\"AI+\"，而是真正的\"AI 原生应用\"。",
        tags: ["🤖 AI 编写工具", "📡 AI 采集数据", "📊 AI 分析数据", "✨ AI 取的名字"]
      }
    },
    team: {
      label: "团队",
      heading: "由一线教师发起",
      desc: "QuickForm 团队由一线教师发起，源自团队间的默契、信任和价值观的一致。",
      members: [
        { name: "谢作如", role: "温州科技高级中学 · AI科创中心主任", bio: "资深程序员与一线教育工作者，QuickForm 的发起人。早年从事网站开发，后转向创客教育与 AI 教育研究。" },
        { name: "方建文", role: "温州大学 · 博士", bio: "来自温州大学教育技术系，为 QuickForm 提供学术支持与研究方向指导，推动项目的理论化与系统化。" },
        { name: "林淼焱", role: "温州科技高级中学", bio: "核心技术开发成员，第一时间将 QuickForm 部署到互联网上进行测试，推动项目从原型走向产品。" }
      ],
      support: {
        title: "支持团队与机构",
        logos: ["XEduPro 团队", "DFRobot", "清华大学出版社", "全国中小学AI与科技教育大会", "全国中小学STEAM教育大会"]
      }
    },
    footer: {
      brand: {
        logo: "QuickForm",
        desc: "让大模型生成的交互网页也能回收数据。努力打通AI赋能教育的\"最后一公里\"。"
      },
      links: {
        title: "链接",
        items: [
          { text: "官方平台", href: "https://quickform.cn" },
          { text: "学习文档", href: "https://quickform.readthedocs.io/" },
          { text: "公众号文章", href: "https://mp.weixin.qq.com/s/ouhSP_UHLfDbQMO2Ch_bkQ" }
        ]
      },
      resources: {
        title: "资源",
        items: [
          { text: "四步入门", href: "https://quickform.readthedocs.io/zh-cn/latest/guide/start.html" },
          { text: "应用案例", href: "https://quickform.readthedocs.io/zh-cn/latest/case.html" },
          { text: "本地部署", href: "https://quickform.readthedocs.io/zh-cn/latest/guide/deploy.html" }
        ]
      },
      contact: {
        title: "联系我们",
        items: [
          { text: "方建文：beginnerfjw@163.com", href: "mailto:beginnerfjw@163.com" },
          { text: "谢作如：8334180@qq.com", href: "mailto:8334180@qq.com" }
        ]
      },
      bottom: {
        left: "© 2025-2026 QuickForm 团队 · 开源免费 · 教师版遵循开源协议",
        right: "由一线教师用 AI 创造"
      }
    }
  },
  en: {
    nav: {
      logo: "QuickForm",
      logoSub: "AI-Native Data Platform",
      links: [
        { text: "Problems", href: "#problem" },
        { text: "Guide", href: "#solution" },
        { text: "How It Works", href: "#principle" },
        { text: "Use Cases", href: "#cases" },
        { text: "Versions", href: "#versions" },
        { text: "Story", href: "#story" }
      ],
      cta: "Visit Platform →"
    },
    hero: {
      badge: "AI-Native Education Tool · Open Source · 4-Step Simple Setup",
      title: "QuickForm",
      subtitle: "Make interactive webpages generated by AI<br>collect data",
      slogan: "Bridging the last mile of AI-enabled education",
      actions: {
        primary: "Start Using QuickForm →",
        secondary: "📖 View Documentation"
      },
      stats: {
        schools: "Schools",
        users: "Registered Teachers",
        tasks: "Data Tasks",
        submissions: "Data Collected"
      }
    },
    problem: {
      label: "Problem",
      heading: "Interactive webpages are amazing<br>but data remains isolated",
      desc: "Teachers can quickly generate interactive webpages like attendance tools, word matching games, and physics simulators using models like DeepSeek and GPT. However, valuable data from students' clicks and choices stays local, unable to automatically gather for teachers.",
      islands: [
        { icon: "🎯", name: "Class Attendance", data: "32 data entries", status: "⚠ Cannot collect" },
        { icon: "🔤", name: "Word Matching", data: "128 data entries", status: "⚠ Cannot collect" },
        { icon: "⚗️", name: "Chemistry Lab", data: "67 data entries", status: "⚠ Cannot collect" },
        { icon: "📊", name: "Online Quiz", data: "256 data entries", status: "⚠ Cannot collect" },
        { icon: "🔬", name: "Physics Simulation", data: "89 data entries", status: "⚠ Cannot collect" },
        { icon: "📝", name: "Interactive Q&A", data: "45 data entries", status: "⚠ Cannot collect" }
      ],
      cards: [
        { icon: "🏝️", title: "Data Islands", desc: "Each AI-generated interactive webpage is an isolated 'data island.' Student interaction data stays in local browsers, making it impossible for teachers to understand actual usage." },
        { icon: "🚧", title: "High Technical Barrier", desc: "To collect data, teachers typically need backend development skills to set up servers and databases. This barrier is too high for most frontline teachers." },
        { icon: "📉", title: "No Teaching Analysis", desc: "Even if word matching games are fun, teachers can't know who played or which words had higher error rates, making effective teaching optimization difficult." }
      ]
    },
    solution: {
      label: "Solution",
      heading: "4-Step Simple Experience",
      desc: "QuickForm doesn't generate webpages itself, but provides data APIs that can aggregate data from any webpage. Complete the entire process from data collection to intelligent analysis in just four steps.",
      steps: [
        { num: "01", icon: "📮", title: "Generate Form URL", desc: "Register a QuickForm account, create a 'data task,' and the system automatically generates a dedicated API endpoint—your 'digital inbox.'" },
        { num: "02", icon: "🤖", title: "Generate Interactive Webpage", desc: "Use your preferred AI model to generate a webpage, just add one sentence to your prompt:", prompt: "Please submit data as a form to<br>https://quickform.cn/api/..." },
        { num: "03", icon: "📋", title: "Collect & View Data", desc: "After students submit data, view all submissions in real-time on QuickForm, with support for viewing individual entries or bulk exporting to Excel." },
        { num: "04", icon: "📊", title: "Generate Smart Report", desc: "One-click AI smart analysis report with submission count, average score, error distribution, frequent issues, and other visualizations to quickly identify teaching priorities." }
      ]
    },
    principle: {
      label: "How It Works",
      heading: "Using AI to solve AI's problems",
      text: {
        title: "Based on Standard Form Technology",
        p1: "QuickForm provides write (POST) and read (GET) data APIs. Any webpage just needs to point the form's <code>action</code> attribute to the QuickForm endpoint, and data will be automatically classified and saved.",
        p2: "Because form technology is mature, all AI models can correctly understand and generate corresponding code—teachers just need to add one sentence to their prompt.",
        quote: "Data doesn't need to be strictly structured because AI can analyze 'messy' data. Users don't need to understand data types or SQL; as long as they can describe their needs, AI can help with subsequent analysis.",
        p3: "This design philosophy inherits Turing's idea of 'using machines to beat machines'—using AI to write tools, collect data, and analyze data, with every step related to AI."
      }
    },
    capabilities: {
      label: "Capabilities",
      heading: "More than just form collection",
      desc: "The same API address can both write and read data, enabling multiple interaction modes.",
      cards: [
        { icon: "📝", title: "Classic Applications", desc: "Submit data to QuickForm using POST method, covering common needs like survey collection, online exams, and class attendance.", tags: ["Surveys", "Online Exams", "Class Attendance"] },
        { icon: "📡", title: "Interactive Analysis", desc: "Submit data with webpage A, then create webpage B to read and analyze in real-time, building data dashboards, cockpits, and large screen displays.", tags: ["Data Dashboards", "Cockpits", "Large Screens"] },
        { icon: "💬", title: "Real-time Interaction", desc: "Submit and read data simultaneously on the same webpage, enabling real-time interaction features like chat rooms, message boards, and bullet screens.", tags: ["Chat Rooms", "Message Boards", "Bullet Screens"] }
      ]
    },
    cases: {
      label: "Use Cases",
      heading: "Used by teachers nationwide",
      desc: "Teachers across China widely use QuickForm in classroom teaching, creative teaching, and real problem-solving scenarios.",
      cards: [
        { emoji: "🏫", title: "Regular Classroom Data Collection", desc: "Embed interactive webpages into daily teaching to efficiently collect classroom practice, quiz, and feedback data.", items: ["Classroom instant practice and testing", "Student attendance and participation statistics", "Real-time display screens for collected data"] },
        { emoji: "🎮", title: "Creative Teaching Applications", desc: "Use AI-generated gamified, simulated interactive webpages to stimulate student interest and collect behavioral data.", items: ["Gamified teaching interactions", "Simulation experiment data collection", "Learning behavior process analysis"] },
        { emoji: "🌍", title: "Real Problem Solving", desc: "Support interdisciplinary learning projects and teaching management scenarios, enabling data-driven teaching decisions.", items: ["Student interdisciplinary learning projects", "Teacher teaching management optimization", "Wenzhou Science and Technology High School case studies"] }
      ]
    },
    versions: {
      label: "Versions",
      heading: "Choose the version that suits you",
      desc: "QuickForm has two versions for different usage scenarios, both available for free.",
      cards: [
        { badge: "Open Source", title: "Teacher Edition", desc: "For individual teachers, providing data collection services for class students within the local network.", features: ["Fully open source, freely modifiable", "Single-user mode, simple and efficient", "Runs on teacher's local computer", "Built-in Python environment", "Portable software, ready to use", "Local network data collection"] },
        { badge: "Free", title: "Campus Edition", desc: "For schools and institutions, deployed on the internet, supporting multi-user collaboration.", features: ["Free after signing cooperation agreement", "Deployed on the internet", "Supports multiple users and roles", "More comprehensive security mechanisms", "Official maintenance and technical support", "Continuous updates and feature iterations"] }
      ]
    },
    story: {
      label: "QuickForm's Story",
      heading: "A Saturday, a conversation<br>The birth of an AI-native project",
      timeline: [
        { date: "Late 2024", title: "Problem Emerges", desc: "After DeepSeek was released, teachers began using AI models to create 'classroom attendance' and 'word matching' interactive webpages. Xie Zuoru keenly noticed that these webpages were static and data couldn't flow." },
        { date: "Early 2025", title: "Thinking and Exploration", desc: "Xie Zuoru published 'Designing Interactive Courseware with AI Models' in China Information Technology Education, starting to look for solutions and hoping educational enterprises would develop data circulation tools." },
        { date: "November 1, 2025", title: "QuickForm Birth", desc: "One Saturday evening, Xie Zuoru opened Trae (ByteDance programming tool) and entered a requirement description. Within two days, the QuickForm prototype was born. The name was also chosen by AI." },
        { date: "November 2025", title: "Team Formation and Beta Test", desc: "Fang Jianwen (Wenzhou University) and Lin Miaoyan quickly joined. Lin Miaoyan deployed QuickForm online the next day. Official beta testing began a week later." },
        { date: "Within a month", title: "Widespread Spread", desc: "With just one public account article, nearly 1000 registered users, with users coming from frontline teachers across the country." }
      ],
      highlight: {
        title: "AI-Native Project",
        p1: "Someone asked, how long did it take to develop QuickForm? The prototype was written in just two days. During maintenance, the team never 'hand-coded' any code.",
        p2: "Using AI to solve new problems brought by AI programming, using AI to collect data and then using AI for analysis—every step is related to AI.",
        p3: "This is no longer traditional 'AI+', but a true 'AI-native application'.",
        tags: ["🤖 AI-written tools", "📡 AI-collected data", "📊 AI-analyzed data", "✨ AI-chosen name"]
      }
    },
    team: {
      label: "Team",
      heading: "Initiated by frontline teachers",
      desc: "The QuickForm team was initiated by frontline teachers, rooted in team synergy, trust, and shared values.",
      members: [
        { name: "Xie Zuoru", role: "Wenzhou Science and Technology High School · Director of AI Innovation Center", bio: "Senior programmer and frontline educator, initiator of QuickForm. Early website developer, later turned to maker education and AI education research." },
        { name: "Fang Jianwen", role: "Wenzhou University · PhD", bio: "From the Department of Educational Technology at Wenzhou University, providing academic support and research direction guidance for QuickForm, promoting the project's theorization and systematization." },
        { name: "Lin Miaoyan", role: "Wenzhou Science and Technology High School", bio: "Core technical development member, first to deploy QuickForm online for testing, driving the project from prototype to product." }
      ],
      support: {
        title: "Support Teams and Organizations",
        logos: ["XEduPro Team", "DFRobot", "Tsinghua University Press", "National Primary and Secondary School AI and Technology Education Conference", "National Primary and Secondary School STEAM Education Conference"]
      }
    },
    footer: {
      brand: {
        logo: "QuickForm",
        desc: "Make interactive webpages generated by AI collect data. Bridging the last mile of AI-enabled education."
      },
      links: {
        title: "Links",
        items: [
          { text: "Official Platform", href: "https://quickform.cn" },
          { text: "Learning Documentation", href: "https://quickform.readthedocs.io/" },
          { text: "Public Account Article", href: "https://mp.weixin.qq.com/s/ouhSP_UHLfDbQMO2Ch_bkQ" }
        ]
      },
      resources: {
        title: "Resources",
        items: [
          { text: "4-Step Guide", href: "https://quickform.readthedocs.io/zh-cn/latest/guide/start.html" },
          { text: "Use Cases", href: "https://quickform.readthedocs.io/zh-cn/latest/case.html" },
          { text: "Local Deployment", href: "https://quickform.readthedocs.io/zh-cn/latest/guide/deploy.html" }
        ]
      },
      contact: {
        title: "Contact Us",
        items: [
          { text: "Fang Jianwen: beginnerfjw@163.com", href: "mailto:beginnerfjw@163.com" },
          { text: "Xie Zuoru: 8334180@qq.com", href: "mailto:8334180@qq.com" }
        ]
      },
      bottom: {
        left: "© 2025-2026 QuickForm Team · Open Source · Teacher Edition follows open source agreement",
        right: "Created by frontline teachers with AI"
      }
    }
  },
  zh_tw: {
    nav: {
      logo: "QuickForm",
      logoSub: "AI原生數據平台",
      links: [
        { text: "痛點", href: "#problem" },
        { text: "使用指南", href: "#solution" },
        { text: "工作原理", href: "#principle" },
        { text: "應用案例", href: "#cases" },
        { text: "版本", href: "#versions" },
        { text: "故事", href: "#story" }
      ],
      cta: "訪問平台 →"
    },
    hero: {
      badge: "AI原生教育工具 · 開源免費 · 四步極簡上手",
      title: "QuickForm",
      subtitle: "讓大模型生成的交互網頁<br>也能回收數據",
      slogan: "努力打通AI賦能教育的\"最後一公里\"",
      actions: {
        primary: "開始使用 QuickForm →",
        secondary: "📖 查看文檔"
      },
      stats: {
        schools: "學校單位",
        users: "註冊教師",
        tasks: "數據任務",
        submissions: "回收數據"
      }
    },
    problem: {
      label: "問題",
      heading: "交互網頁雖然精彩<br>但數據卻是一座座\"孤島\"",
      desc: "教師藉助 DeepSeek、GPT 等大模型可以快速生成課堂點名工具、單詞連連看、物理實驗模擬等精美交互網頁。然而，學生的每一次點擊、每一個選擇，這些有價值的數據都停留在本地，無法自動匯聚到教師手中。",
      islands: [
        { icon: "🎯", name: "課堂點名", data: "32條數據", status: "⚠ 無法回收" },
        { icon: "🔤", name: "單詞連連看", data: "128條數據", status: "⚠ 無法回收" },
        { icon: "⚗️", name: "化學實驗", data: "67條數據", status: "⚠ 無法回收" },
        { icon: "📊", name: "線上測驗", data: "256條數據", status: "⚠ 無法回收" },
        { icon: "🔬", name: "物理模擬", data: "89條數據", status: "⚠ 無法回收" },
        { icon: "📝", name: "互動問答", data: "45條數據", status: "⚠ 無法回收" }
      ],
      cards: [
        { icon: "🏝️", title: "數據孤島", desc: "每個AI生成的交互網頁都是獨立的\"數據孤島\"，學生在前端的操作數據停留在本地瀏覽器，教師無法了解學生的真實使用情況。" },
        { icon: "🚧", title: "技術門檻過高", desc: "要實現數據回收，通常需要教師具備後端開發能力，自行搭建伺服器和數據庫。這對大多數一線教師而言門檻過高。" },
        { icon: "📉", title: "無法教學分析", desc: "即使\"單詞連連看\"再好玩，教師也沒有辦法知道哪些人在玩這個程式、哪些單詞的錯誤率比較高，難以開展有效的教學優化。" }
      ]
    },
    solution: {
      label: "解決方案",
      heading: "四步極簡體驗",
      desc: "QuickForm 本身不生成網頁，但提供了數據介面，能夠把任何網頁的數據彙總起來。只需四步，即可完成從數據收集到智能分析的全流程。",
      steps: [
        { num: "01", icon: "📮", title: "生成表單地址", desc: "註冊 QuickForm 帳號，創建一個\"數據任務\"，系統自動生成專屬的 API 介面地址——您的\"數字收件箱\"。" },
        { num: "02", icon: "🤖", title: "生成交互網頁", desc: "用您熟悉的大模型生成網頁，只需在提示詞中加入一句話：", prompt: "請將數據以表單形式提交至<br>https://quickform.cn/api/..." },
        { num: "03", icon: "📋", title: "收集與查看數據", desc: "學生提交數據後，在 QuickForm 實時查看所有提交記錄，支援逐條查看或批量匯出為 Excel 表格。" },
        { num: "04", icon: "📊", title: "生成智能報告", desc: "一鍵生成 AI 智能分析報告，包含提交人數、平均分、錯誤分布、高頻問題等可視化內容，快速把握教學重難點。" }
      ]
    },
    principle: {
      label: "工作原理",
      heading: "用 AI 解決 AI 的問題",
      text: {
        title: "基於標準表單技術",
        p1: "QuickForm 提供了寫入（POST）和讀出（GET）的數據介面。任何網頁只需將表單的 <code>action</code> 屬性指向 QuickForm 端點，數據就會自動分類保存。",
        p2: "因為表單技術非常成熟，所有大模型都能正確理解並生成對應代碼——教師只需在提示詞中加一句話。",
        quote: "數據不需要嚴格規範，因為大模型能分析'凌亂'的數據。用戶不用了解數據類型和 SQL，只要能描述需求，AI 就能幫你完成後續分析。",
        p3: "這一設計理念繼承了圖靈\"用機器打敗機器\"的思想——用 AI 編寫工具、用 AI 采集數據、再用 AI 分析數據，每一個環節都與 AI 相關。"
      }
    },
    capabilities: {
      label: "能力邊界",
      heading: "不止是表單回收",
      desc: "同一個 API 地址，既能寫入也能讀出，由此衍生出多種交互模式。",
      cards: [
        { icon: "📝", title: "經典應用", desc: "將數據用 POST 方式提交到 QuickForm，覆蓋問卷回收、線上考試、課堂簽到等常見需求。", tags: ["問卷調查", "線上考試", "課堂簽到"] },
        { icon: "📡", title: "交互分析", desc: "用網頁 A 提交數據，再做一個網頁 B 實時讀取並分析，構建數據看板、數據駕駛艙與大螢幕展示。", tags: ["數據看板", "駕駛艙", "大螢幕展示"] },
        { icon: "💬", title: "即時互動", desc: "在同一個網頁上邊提交數據、邊讀取數據，實現聊天室、留言板、彈幕牆等即時交互功能。", tags: ["聊天室", "留言板", "彈幕牆"] }
      ]
    },
    cases: {
      label: "應用案例",
      heading: "全國教師正在使用",
      desc: "來自全國各地的教師在課堂教學、創意教學和真實問題解決中廣泛應用 QuickForm。",
      cards: [
        { emoji: "🏫", title: "常規課堂數據收集", desc: "將交互網頁嵌入日常教學，高效收集課堂練習、測驗和反饋數據。", items: ["課堂即時練習與檢測", "學生簽到與課堂參與度統計", "為回收數據編寫實時展示大螢幕"] },
        { emoji: "🎮", title: "創意教學應用", desc: "藉助 AI 生成的遊戲化、模擬化交互網頁，激發學生興趣並采集行為數據。", items: ["遊戲化教學互動", "仿真實驗數據采集", "學習行為過程分析"] },
        { emoji: "🌍", title: "真實問題解決", desc: "支撐跨學科學習專案和教學管理場景，讓數據驅動教學決策。", items: ["學生跨學科學習專案", "教師教學管理優化", "溫州科技高中案例精選"] }
      ]
    },
    versions: {
      label: "版本介紹",
      heading: "選擇適合您的版本",
      desc: "QuickForm 分為兩個版本，面向不同使用場景，均可免費使用。",
      cards: [
        { badge: "開源", title: "教師版", desc: "面向個人教師，在局域網內為班級學生提供數據收集服務。", features: ["完全開源，自由修改", "單用戶模式，簡潔高效", "運行在教師本地電腦上", "內置 Python 環境", "綠色軟體，解壓即用", "局域網內數據收集"] },
        { badge: "免費", title: "校園版", desc: "面向學校和機構，部署在網際網路上，支援多使用者協作。", features: ["簽署合作協議後免費使用", "部署在網際網路上", "支援多使用者、多角色", "更完善的安全機制", "官方維護與技術支援", "持續更新與功能迭代"] }
      ]
    },
    story: {
      label: "QuickForm 的故事",
      heading: "一個周六，一段對話<br>一個 AI 原生專案的誕生",
      timeline: [
        { date: "2024 年底", title: "問題浮現", desc: "DeepSeek 發布後，教師們紛紛用大模型寫\"課堂點名\"\"單詞連連看\"等交互網頁。謝作如敏銳地發現：這些網頁只是靜態的，數據無法流通。" },
        { date: "2025 年初", title: "思考與探索", desc: "謝作如在《中國資訊技術教育》發表《藉助大模型設計交互式課件》，開始尋找解決方案，期望教育企業能開發數據流通工具。" },
        { date: "2025 年 11 月 1 日", title: "QuickForm 誕生", desc: "一個周六的晚上，謝作如打開 Trae（字節跳動編程工具），輸入了一段需求描述。兩天時間，QuickForm 原型誕生。名字也是 AI 取的。" },
        { date: "2025 年 11 月", title: "團隊組建與公測", desc: "方建文（溫州大學）和林淼焱迅速加入。林淼焱第二天就把 QuickForm 部署上線。一周後正式公測。" },
        { date: "一個月內", title: "廣泛傳播", desc: "僅靠一篇公眾號文章，註冊使用者接近 1000 名，使用者來自全國各地的一線教師。" }
      ],
      highlight: {
        title: "AI 原生專案",
        p1: "有人問，開發 QuickForm 花了多少時間？原型編寫只花了兩天。在維護過程中，團隊從未\"手搓\"過代碼。",
        p2: "用 AI 解決 AI 編程帶來的新問題，用 AI 采集到的數據再藉助 AI 進行分析——每一個環節都與 AI 有關。",
        p3: "這不再是傳統的\"AI+\"，而是真正的\"AI 原生應用\"。",
        tags: ["🤖 AI 編寫工具", "📡 AI 采集數據", "📊 AI 分析數據", "✨ AI 取的名字"]
      }
    },
    team: {
      label: "團隊",
      heading: "由一線教師發起",
      desc: "QuickForm 團隊由一線教師發起，源自團隊間的默契、信任和價值觀的一致。",
      members: [
        { name: "謝作如", role: "溫州科技高級中學 · AI科創中心主任", bio: "資深程式設計師與一線教育工作者，QuickForm 的發起人。早年從事網站開發，後轉向創客教育與 AI 教育研究。" },
        { name: "方建文", role: "溫州大學 · 博士", bio: "來自溫州大學教育技術系，為 QuickForm 提供學術支援與研究方向指導，推動專案的理論化與系統化。" },
        { name: "林淼焱", role: "溫州科技高級中學", bio: "核心技術開發成員，第一時間將 QuickForm 部署到網際網路上進行測試，推動專案從原型走向產品。" }
      ],
      support: {
        title: "支援團隊與機構",
        logos: ["XEduPro 團隊", "DFRobot", "清華大學出版社", "全國中小學AI與科技教育大會", "全國中小學STEAM教育大會"]
      }
    },
    footer: {
      brand: {
        logo: "QuickForm",
        desc: "讓大模型生成的交互網頁也能回收數據。努力打通AI賦能教育的\"最後一公里\"。"
      },
      links: {
        title: "連結",
        items: [
          { text: "官方平台", href: "https://quickform.cn" },
          { text: "學習文檔", href: "https://quickform.readthedocs.io/" },
          { text: "公眾號文章", href: "https://mp.weixin.qq.com/s/ouhSP_UHLfDbQMO2Ch_bkQ" }
        ]
      },
      resources: {
        title: "資源",
        items: [
          { text: "四步入門", href: "https://quickform.readthedocs.io/zh-cn/latest/guide/start.html" },
          { text: "應用案例", href: "https://quickform.readthedocs.io/zh-cn/latest/case.html" },
          { text: "本地部署", href: "https://quickform.readthedocs.io/zh-cn/latest/guide/deploy.html" }
        ]
      },
      contact: {
        title: "聯繫我們",
        items: [
          { text: "方建文：beginnerfjw@163.com", href: "mailto:beginnerfjw@163.com" },
          { text: "謝作如：8334180@qq.com", href: "mailto:8334180@qq.com" }
        ]
      },
      bottom: {
        left: "© 2025-2026 QuickForm 團隊 · 開源免費 · 教師版遵循開源協議",
        right: "由一線教師用 AI 創造"
      }
    }
  }
};
