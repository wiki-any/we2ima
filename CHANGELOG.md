# Changelog

本项目所有重要变更记录于本文件。
All notable changes to this project will be documented in this file.

格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/),版本号遵循 [SemVer](https://semver.org/lang/zh-CN/)。
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versioning follows [SemVer](https://semver.org/).

---

## [1.1.0] - 2026-09-15

本次更新是一次打包与更新体系重构及导入体验增强版本：分发方式从压缩包改为 Windows 安装包（运行全程零临时解压，根治杀毒软件误报与文件锁定导致的启动失败，启动更快更稳定）；自动更新升级为完整安装包静默升级；新增安装完整性自检、文章打开方式自适应与慢速导入模式提示；快速导入升级为持久化全局偏好并覆盖定时与全自动任务，且速度大幅优化（实测仅导入"链接"分类目录白天约 150 篇/小时、双目录导入约 95 篇/小时，较优化前提升近一倍）。本次发布一并包含下方 v1.0.4 开发周期（未单独对外发布）的全部更新。
This release is a packaging-and-update overhaul plus import-experience update: distribution moves from a zip archive to a Windows installer (zero temporary extraction at runtime, permanently fixing the antivirus false positives and file locks that broke startup, with faster and more stable launches); automatic updates now silently run a full installer; new install-integrity self-check, adaptive open-mode handling, and a Slow Import Mode notice are added; Fast Import becomes a persisted global preference covering scheduled and Full Auto tasks, and is now significantly faster (measured ~150 articles/hour daytime when importing to the "Links" category directory only, ~95 articles/hour for dual-directory imports — nearly double the previous speed). It also includes everything from the v1.0.4 development cycle below (never released separately).

### ✨ 新增 / Added

- 新增 Windows 安装包分发方式。软件改为通过安装向导安装，默认目录优先 D 盘等非系统盘；安装后运行全程零临时解压，启动更快；数据库、配置等数据始终保存在安装目录内，覆盖安装与卸载均不影响数据。
  Added Windows installer-based distribution. The app is now installed via a setup wizard, with the default directory preferring a non-system drive such as D:. After installation the app runs with zero temporary extraction and starts faster; your database, settings, and other data always live inside the install directory, and neither reinstalling over the top nor uninstalling touches your data.
- 新增安装完整性自检。重装系统后启动软件时，自动检查桌面快捷方式、卸载入口与开机自启项，缺失时弹窗提示并可一键修复（可勾选"不再提示"）。
  Added an install-integrity self-check. After an OS reinstall, launching the app automatically checks the desktop shortcut, the uninstall entry, and the auto-start item; if anything is missing, a dialog offers one-click repair (with a "Don't ask again" option).
- 新增文章打开方式自适应。微信"使用系统默认浏览器打开网页"勾选状态与当前打开模式不匹配时弹窗引导：直接打开模式下可一键自动切换"URL打开模式"继续导入（当前文章直接经查看器短链完成导入，不浪费这次打开）；"URL打开模式"下可前往微信取消勾选后自动重新打开检测，或选择停止任务；60 秒倒计时兜底，直接打开场景支持"不再提示"静默自动切换；无人值守任务不弹窗，自动按安全默认方式处理。
  Added adaptive article open-mode handling: when WeChat's "open web pages with the system default browser" option mismatches the current open mode, a dialog guides the fix — in direct-open mode you can switch to "Open Articles via URL" with one click and keep importing (the current article is still imported via the viewer short link, so the click is not wasted); in URL mode you can uncheck the option in WeChat and have the article automatically re-opened and re-detected, or stop the task; a 60-second countdown applies the default action, the direct-open scenario supports "Don't ask again" silent switching, and unattended tasks never show the dialog.
- 新增慢速导入模式提示。手动点击"开始"且未勾选"快速导入"时，提示当前为慢速导入模式（约 30 篇文章/小时，速度慢但稳定，被微信风控强制退出导致任务中断的风险很低），并告知切换快速导入的方式（约 95~150 篇/小时，试验环境测试值）；可直接取消本次启动先去勾选。
  Added a Slow Import Mode notice. When you click "Start" manually without enabling "Fast Import", a dialog explains the current slow mode (about 30 articles/hour — slower but stable, with very low risk of WeChat risk-control forced exits interrupting the task) and how to switch to Fast Import (about 95–150 articles/hour, tested in an experimental environment); you can cancel the start directly to go enable Fast Import first.

### 💡 优化 / Improved

- 自动更新升级为完整安装包静默升级。检测到新版本后后台自动预下载并完成安全校验，确认后软件自动退出、静默覆盖安装并自动重启，重启后提示"已更新至 x.y.z"；更新过程不影响数据库与配置数据。
  Automatic updates upgraded to a silent full-installer flow. When a new version is detected, the installer is pre-downloaded in the background and security-verified; after you confirm, the app exits by itself, silently installs over the top, and relaunches automatically, then confirms with an "Updated to x.y.z" message. Your database and settings remain untouched throughout.
- 快速导入从"会话级实验开关"升级为持久化全局偏好。勾选状态永久保存、重启软件后保持，并同时应用于手动、定时及全自动导入任务（解除此前定时任务与全自动模式强制关闭快速导入的限制）；勾选时的确认弹窗补充了速度说明。
  Fast Import upgraded from a session-only experimental switch to a persisted global preference. Your choice is saved permanently and survives restarts, and now applies to manual, scheduled, and Full Auto import tasks alike (the previous restriction that forced Fast Import off for scheduled and Full Auto tasks is removed); the confirmation dialog now also states the expected speed.
- 快速导入速度大幅优化。清理导入链路中的多处冗余固定等待（双目录导入间隔的 10 秒冷却、重复的点击前等待、每篇文章的固定就绪等待），导入完成等待改为事件驱动、完成即走；IMA 扩展版本检查由每篇文章重复执行精简为每个导入任务仅在首篇执行一次。实测导入速度：仅导入"链接"分类目录时白天约 150 篇/小时、夜间约 125 篇/小时，自定义标签双目录导入时白天约 95 篇/小时、夜间约 75 篇/小时，较优化前（约 60 秒/篇）提升近一倍，已超过老版本 80~90 篇/小时的水平；"URL打开模式"因取链链路更长，速度略低于上述实测值。夜间导入默认批次参数同步调整为每 10 篇一批次、批次间休息 2 分钟（原默认每 5 篇一批次）。
  Fast Import is significantly faster. Removed several redundant fixed waits from the import pipeline (the 10-second cooldown between dual-directory targets, duplicate pre-click waits, and the per-article fixed readiness wait), and post-click completion waiting is now event-driven; the IMA extension version check now runs only once at the first article of each import task instead of for every article. Measured throughput: ~150 articles/hour (day) and ~125/hour (night) when importing to the "Links" category directory only, and ~95/hour (day) / ~75/hour (night) for dual-directory custom-tag imports — nearly double the pre-optimization speed (~60 seconds/article) and above the legacy version's 80–90 articles/hour; "Open Articles via URL" mode is slightly slower due to its longer link-capture chain. The night-batch default is now 10 articles per batch with a 2-minute rest (was 5 articles per batch).
- 根治打包版软件启动/退出临时目录报错。软件改为安装目录静态运行，彻底不再向系统临时目录解压文件，从架构上消除杀毒软件实时扫描锁定导致的"Failed to load Python DLL"启动失败与"Failed to remove temporary directory"退出报错，同时消除该类行为特征引发的杀毒软件误报。
  Permanently fixed the packaged build's startup/exit temporary-directory errors. The app now runs statically from its install directory and never extracts files to the system temp folder, eliminating at the architecture level the antivirus real-time-scan locks behind the "Failed to load Python DLL" startup failures and "Failed to remove temporary directory" exit errors — and removing the behavior signature that triggered antivirus false positives in the first place.
- Chrome 浏览器扩展插件已内置进安装包，首启即用、无需联网下载；后续扩展出新版本时仍由后台更新检查自动升级。
  Chrome browser extensions are now bundled in the installer — ready on first launch with no download; future extension updates are still delivered automatically by background update checks.

### 🐛 修复 / Fixed

- 修复微信"使用系统默认浏览器打开网页"勾选状态与当前打开模式不匹配时，文章可能重试耗尽后被误标跳过、或任务被直接停止的问题；检测异常时另有查看器挽救兜底，最大限度避免误标跳过。
  Fixed articles being mis-marked as skipped after exhausting retries — or the task being stopped outright — when WeChat's "Open web pages with the system default browser" option didn't match the current open mode; a viewer-salvage fallback further guards against mis-skips when detection itself fails.
- 修复恢复中断任务后，该任务的导入速度模式可能泄漏到后续定时/全自动任务的问题；无人值守任务现在始终遵循您保存的快速导入偏好。
  Fixed a resumed task's import-speed mode leaking into subsequent scheduled/Full Auto tasks; unattended tasks now always follow your saved Fast Import preference.
- 修复通过安装包安装后桌面可能出现两个"微兔"快捷方式的问题。安装完整性自检此前只检查用户桌面，未识别安装包写入快捷方式的公共桌面，导致每次启动误报"快捷方式缺失"、点击修复后在用户桌面重复创建；现自检同时识别公共桌面与用户桌面，修复统一补齐到公共桌面（与安装包行为一致，卸载时可自动清理），升级后首次启动还会自动清理用户桌面上残留的重复副本。
  Fixed duplicate We2ima desktop shortcuts after installing via the setup package. The install-integrity self-check previously only checked the user desktop and missed the public desktop where the installer creates shortcuts, so it falsely reported the shortcut as missing on every launch and created a second copy on repair; the self-check now recognizes both desktop locations, repairs to the public desktop (matching the installer, so uninstall cleans it up), and silently removes the leftover duplicate from the user desktop on first launch after upgrading.

### 📝 提示 / Notes

- 老用户（v1.0.3 及更早的压缩包版本）请按官网 [迁移指导](https://www.we2ima.com/guides/migrate-to-installer/) 操作：将旧目录中的 config、updates、We2ImaDB 三个文件夹复制到新安装目录，即可完整保留扫描数据、导入历史与付费信息，同一台电脑无需重新激活。
  Upgrading from v1.0.3 or earlier (zip versions)? Follow the [migration guide](https://www.we2ima.com/guides/migrate-to-installer/): copy the config, updates, and We2ImaDB folders from the old directory into the new install directory to keep all scan data, import history, and license information — no re-activation needed on the same PC.
- 从 v1.1.0 起，旧压缩包版本（v1.0.3 及更早）的软件内自动更新不再接收新版本推送，请前往官网下载页下载安装包完成迁移。
  Starting with v1.1.0, the in-app updater of older zip versions (v1.0.3 and earlier) no longer receives new releases; please download the installer from the official download page to migrate.
- 建议安装在 D 盘等非系统盘，避免因重装系统导致支付凭证和数据库文件丢失；卸载软件不会删除您的数据。
  Installing to a non-system drive (e.g. D:) is recommended so payment credentials and database files survive OS reinstalls; uninstalling the app never deletes your data.
- 重要：如果您从未在软件中设置过数据库密码，重装操作系统后旧数据库将无法打开（Windows 加密密钥随系统重建）；建议提前在设置中设置数据库密码。
  Important: if you have never set a database password in the app, your old database cannot be opened after an OS reinstall (the Windows encryption key is rebuilt with the OS); set a database password in Settings in advance.
- Windows SmartScreen 可能对安装包提示"Windows 已保护你的电脑"（软件暂未购买代码签名证书），点击"更多信息 → 仍要运行"即可正常安装；新架构已消除运行时解压行为，杀毒软件误报概率大幅降低。
  Windows SmartScreen may show "Windows protected your PC" for the installer (no code-signing certificate yet) — click "More info → Run anyway" to proceed; the new architecture eliminates runtime extraction, so antivirus false positives are far less likely.
- 自动更新执行安装过程中可能出现一次系统授权（UAC）弹窗，属预期行为，允许即可完成升级。
  A single system authorization (UAC) prompt during the automatic-update install step is expected — allow it to finish upgrading.
- 无人值守任务（定时任务/全自动）现在也会应用您保存的"快速导入"偏好；如希望其以慢速稳定模式运行，请先取消勾选主页的"快速导入"。
  Unattended tasks (scheduled / Full Auto) now also follow your saved "Fast Import" preference; to keep unattended runs in the slow, stable mode, uncheck "Fast Import" on the Home page first.
- v1.1.0 要求当前实际运行的 IMA 优化版扩展版本不低于 `1.1.3.1`，阅读标记扩展不低于 `0.1.1`；Chrome 扩展已随安装包内置安装。
  v1.1.0 requires the IMA optimized extension currently running in Chrome to be version `1.1.3.1` or later, and the read-marker extension `0.1.1` or later; Chrome extensions are bundled with the installer.
- 自 v1.1.0 起仅支持 Chrome 浏览器：必须安装 Chrome，但无需设为系统默认浏览器（默认浏览器不是 Chrome 时软件启动后会自动适配）；不再适配 Edge、QQ浏览器、360极速浏览器、夸克浏览器。
  Starting with v1.1.0, only Google Chrome is supported: Chrome must be installed but does not need to be the system default browser (We2ima adapts automatically at launch when it is not); Edge, QQ Browser, 360 Speed Browser, and Quark are no longer adapted.

---

## [1.0.4] - 2026-08-31 （未单独对外发布 / Never released separately）

> 本开发周期从未单独对外发布：因改动量大且其后追加了打包体系重构等重大优化，对外版本号由 v1.0.3 直接升级为 v1.1.0；以下全部内容已并入上方 [1.1.0] 一并发布，此处完整保留存档。
> This development cycle was never released on its own — the public version jumped straight from v1.0.3 to v1.1.0. Everything below ships as part of [1.1.0] above and is preserved here as an archive.

本次更新是一次本地客户端功能增强与 Bug 修复版本，新增 30 日标签趋势、阅读标记公众号排行、自动更新、季付套餐、套餐折扣与支付前核价、收藏夹标签列表导出等能力，打通非 Chrome 默认浏览器场景的“使用URL打开文章”导入链路（微信内置查看器短链，根治 ima 重复导入），并将阅读标记统计页升级为侧栏导航布局，重点提升阅读标记、首次使用引导、扫描导入和设置页稳定性，并增强导入与扫描暂停响应、增量扫描中断继续、异常中断恢复、IMA 多分辨率与浏览器缩放适配、扩展版本兼容检测及 Chrome 主窗口识别能力，修复打包版软件启动/退出时的临时目录报错；同时调整付费套餐价格与配额。
This is a local-client feature and bug-fix release that adds 30-day tag trends, a read-marker publisher ranking, automatic updates, a new Quarterly plan, plan discounts with pay-time price verification, and favorites tag-list export, unblocks the “Open Articles via URL” import path for non-Chrome default-browser setups (short links copied from the built-in WeChat viewer, eliminating duplicate ima imports), reorganizes the read-marker statistics page with sidebar navigation, improves read markers, first-run onboarding, scan/import workflows, and Settings stability, and strengthens import and scan pause handling, incremental-scan resume, interruption recovery, IMA scaling and browser-zoom compatibility, extension-version checks, and Chrome main-window detection, and fixes the packaged build's startup/exit temporary-directory errors, while adjusting paid-plan prices and quotas.

### ✨ 新增 / Added

- 新增本地客户端自动更新功能。检测到新版本后，可在软件内查看更新状态并启动自动升级流程。
  Added an in-app automatic update entry. When a new version is available, users can view update status and start the automatic update flow from the client.
- 新增浏览器扩展更新支持。自动更新流程可处理 IMA 导入扩展插件和阅读标记扩展插件。
  Added browser extension update support. The automatic update flow can handle both the IMA import extension and the read-marker extension.
- 新增首次启动主题选择引导。新用户确认协议后，可预览并选择界面主题色。
  Added first-run theme onboarding. New users can preview and choose a UI theme after accepting the agreement.
- 新增首次使用前提示入口。用户可在 About/关于 页面重新查看首次使用前提示。
  Added a review entry for the first-use readiness guide in the About page.
- 新增订阅到期提醒。根据当前套餐余量、未激活套餐和试用状态，给出更明确的续费、激活或购买提醒。
  Added startup subscription reminders based on current quota, unused activation codes, and trial status.
- 新增首次启动“使用情况调研”弹窗，采集用户来源渠道（途径、平台、内容形式）并支持可选邮箱订阅版本更新提醒。
  Added a first-run “User Research” dialog that collects how users discovered the app (channel, platform, content form) with an optional email subscription for update notifications.
- 新增 IMA 扩展运行时版本兼容检测。每次实际执行 IMA 点击前都会检查当前 Chrome 中正在运行的扩展版本；版本过旧、缺失、格式异常或未响应时会在点击前安全停止，并提供升级指南入口。
  Added runtime compatibility checks for the IMA extension. Before each real IMA click cycle, We2ima checks the extension version currently running in Chrome; outdated, missing, malformed, or unresponsive extensions stop safely before any click and show an upgrade-guide entry.
- 新增实验性 IMA DOM 点击模式，可在设置页手动开启；默认仍使用真实鼠标点击。
  Added an experimental IMA DOM-click mode that can be enabled manually in Settings. Real-mouse clicking remains the default.
- 新增“30日标签趋势”。可从标签概览打开近 30 天 Top 20 标签新增文章累计图，并查看近 12 个月按月变化的动态排名；动态排名支持播放/暂停、逐月切换、月份拖动和 0.5×/1×/1.5×/2× 四档速度；图表使用当前软件主题并通过系统浏览器离线展示。
  Added “30-Day Tag Trends” from Tag Overview, with a Top-20 chart of articles added over the last 30 days and an animated monthly ranking across the last 12 months. The monthly ranking supports play/pause, month-by-month stepping, a month slider, and 0.5×/1×/1.5×/2× speeds. Charts use the current app theme and open offline in the system browser.
- 新增阅读标记统计页“公众号排行”。可查看近 30 日各公众号新增已读文章排行（Top 20），以及近 1 年按月变化的动态排名；播放控制与标签趋势一致，手动切换月份后保持暂停状态，并适配系统“减少动态效果”偏好。
  Added a “Publisher Rankings” view to the read-marker statistics page, showing the Top 20 publishers by newly read articles in the last 30 days and an animated monthly ranking across the last 12 months. Playback controls match the tag-trend page, manual month changes keep the paused state, and the system “reduce motion” preference is respected.
- 新增阅读标记扩展升级主动提醒。检测到正在运行的阅读标记扩展版本过旧时，软件每次启动最多主动提醒一次，可直接打开官网升级指导页面，按备份、原位替换、重新加载的步骤完成升级。
  Added a proactive read-marker extension upgrade reminder. When an outdated read-marker extension is detected running, the app shows at most one reminder per launch, with direct access to the official upgrade guide covering backup, in-place replacement, and reload steps.
- 新增套餐折扣展示与支付前核价。订阅页套餐卡可展示划线原价、折扣（如 8折）与折后价；点击“支付”时会重新核对服务器最新价格，价格或折扣有变化时先提示并刷新套餐卡，确认后按新价格重新支付；实付金额始终以服务器按折后价计算为准。
  Added plan discount display and pay-time price verification. Subscription plan cards can show the strikethrough list price, the discount (e.g. 20% off), and the sale price; clicking "Pay" re-checks the latest server catalog first, and if prices or discounts changed, the app refreshes the plan cards and asks you to confirm before paying again; the charged amount is always calculated by the server from the discounted price.
- 新增“季付”套餐档位。订阅页套餐卡由 5 档扩展为 6 档，新增季付套餐（29.9 元 / 5000 次导入 / 90 天），支持季付激活码激活、订阅到期提醒与支付前核价全流程。
  Added a new Quarterly plan tier. The subscription page now shows 6 plan cards instead of 5, including the new Quarterly plan (¥29.9 / 5,000 imports / 90 days), with full support for Quarterly activation codes, subscription reminders, and pay-time price verification.
- 新增主页“导出微信收藏夹标签列表”功能。可将已扫描到的微信收藏夹用户自定义标签一键导出为 txt 文件（每行一个标签），文件名自动附带日期时间戳，保存位置可自由选择。
  Added an “Export WeChat Favorites Tag List” button on the Home page. Scanned user-defined favorites tags can be exported to a txt file (one tag per line) with an automatic date-time stamp in the file name, saved to a location of your choice.
- 新增系统默认浏览器自动检测与适配。每次启动时自动检测默认浏览器：默认浏览器不是 Chrome 时自动开启“使用URL打开文章”模式（无需修改系统默认浏览器，只需安装 Chrome）；默认浏览器是 Chrome 时自动保持关闭。
  Added automatic default-browser detection and adaptation. On every launch, We2ima checks the system default browser: if it is not Chrome, the “Open Articles via URL” mode is enabled automatically (no need to change the system default browser — you only need Chrome installed); if it is Chrome, the mode stays off.

### 💡 优化 / Improved

- 调整付费套餐价格与配额（2026-08-21 起生效）：月付 9.9 元 / 1000 次 / 30 天；半年付 68 元 / 15000 次 / 180 天；年付 128 元 / 35000 次 / 365 天；终身版 188 元；按量付费 0.012 元/条；免费试用 50 篇、免费版每天 5 篇与 Full Auto 解锁 5 元保持不变。
  Adjusted paid-plan prices and quotas (effective 2026-08-21): Monthly ¥9.9 / 1,000 imports / 30 days; Half-Yearly ¥68 / 15,000 imports / 180 days; Yearly ¥128 / 35,000 imports / 365 days; Permanent ¥188; Pay-Per-Use ¥0.012 per article. The 50-article free trial, the 5-articles-per-day free tier, and the ¥5 Full Auto unlock remain unchanged.

- 优化阅读标记匹配逻辑，减少部分新结构的微信公众号文章无法显示已读悬浮标记的问题。
  Improved read-marker matching to reduce missing read overlays on some newer WeChat Official Account articles.
- 优化阅读状态保存机制，阅读过程中会更及时的记录进度，直接关闭浏览器或浏览器异常退出后，阅读状态也不容易丢失。
  Improved read-state persistence so progress is recorded more promptly while reading, reducing state loss when the browser is closed directly or exits unexpectedly.
- 优化首次使用前提示内容与布局，更清楚说明上手成本、任务耗时、导入范围、收藏整理建议和付费规则。
  Improved the first-use readiness guide with clearer information about setup effort, task duration, import scope, collection organization, and paid plans.
- 优化扫描和导入日期范围输入。日期顺序填反时，程序会自动纠正并继续流程。
  Improved scan and import date-range input. If dates are entered in reverse order, the client now corrects them automatically and continues.
- 优化主页中日期范围自动刷新。扫描数据变化后，切回主页会自动更新默认日期范围，同时不会覆盖用户已经手动编辑的日期。
  Improved Home page date-range refresh. When scan data changes, default date ranges refresh after returning to Home without overwriting user-edited dates.
- 优化扫描恢复入口，移除旧的“从上次中断处继续”单选框，统一通过“未完成扫描任务”恢复入口处理。
  Improved scan recovery by removing the old “continue from last stop” radio option and consolidating recovery into the unfinished-scan task entry.
- 优化设置页语言和主题显示同步，切换语言或主题后，选择框显示与实际配置保持一致。
  Improved Settings language and theme synchronization so selection fields stay aligned with the actual configuration.
- 优化扩展目录选择体验，新增应用内目录选择器替换系统目录对话框。
  Improved extension directory selection with a new in-app directory picker that replaces the system folder dialog.
- 优化首次启动版本提示弹窗，移除重复维护的版本更新明细，改为指向官网下载页查看完整更新记录。
  Improved the first-run release-notice dialog by removing duplicated version details and linking to the official download page for the full changelog.
- 优化 IMA 目录定位坐标换算，适配单显示器下 Chrome 50%、80%、100%、125%、150% 页面缩放及常见 Windows 显示缩放场景；无法确认坐标空间时会安全停止，不再猜测位置继续点击。
  Improved IMA coordinate mapping for Chrome page zoom levels of 50%, 80%, 100%, 125%, and 150%, plus common Windows display-scaling configurations on a single monitor. If the coordinate space cannot be verified, the task now stops safely instead of guessing a click position.
- 优化实验性 DOM 点击时序，目录滚动并居中后等待约 2 秒再点击，降低界面尚未稳定时的误操作风险。
  Improved experimental DOM-click timing by waiting about two seconds after the target directory is scrolled into view and centered before clicking.
- 优化 IMA 扩展升级提醒弹窗，弹窗现以软件主窗口为参照居中显示。
  Improved the IMA extension upgrade dialog so it is centered relative to the main application window.
- 优化导入任务暂停响应。快速、慢速导入在文章加载、IMA 状态查询、扩展弹窗触发和点击前等待等阶段均可及时响应 `Alt+P`，恢复后继续剩余等待，暂停时长不再消耗超时预算。
  Improved import-task pause responsiveness. Fast and slow imports now honor `Alt+P` during article loading, IMA status polling, extension-popup triggering, and pre-click waits; remaining waits resume afterward without counting paused time against timeouts.
- 优化标签趋势图首开渲染和排序，确保近 30 日累计图首次打开即可见，并按新增数量从多到少展示。
  Improved first-open rendering and ordering for tag-trend charts so the 30-day chart is visible immediately and sorted by descending new-article count.
- 优化阅读标记统计页整体布局。原顶部标签升级为深蓝色左侧栏导航，分为统计概览、已读文章、公众号排行、关于四个板块；侧栏保留“本地数据”标识，强调统计数据仅保存在本机；新增“关于”板块，说明功能范围、统计口径、本地数据与隐私和最低扩展版本；窄屏下可通过菜单按钮展开导航。
  Improved the read-marker statistics page layout. The top tabs are replaced by a dark-blue sidebar with four sections — Overview, Read Articles, Publisher Rankings, and About; the sidebar keeps the “Local data” marker to stress that statistics stay on the device; the new About section explains the feature scope, counting rules, local-data privacy, and the minimum extension version; on narrow screens the navigation opens via a menu button.
- 优化阅读标记统计页与标签趋势的视觉一致性。两处趋势页面统一使用本地内置品牌字体、真实应用图标、胶囊式页签、图表卡片与品牌蓝配色，月度趋势在图表区显示当前月份水印；字体与图标完全内嵌本地，离线可用，不加载任何外网资源。
  Improved visual consistency between the read-marker statistics page and tag trends. Both trend pages now share locally bundled brand fonts, the real app icon, capsule tabs, unified chart cards, and the brand-blue palette, with a current-month watermark on monthly trends; fonts and icons are embedded locally, work offline, and load no external resources.
- 优化“30日标签趋势”页面口径透明化。页面副标题明示标签范围（按近 30 天新增数取前 N 个标签）、统计窗口日期和“不含已删除文章”口径，便于与统计页列表手动计数对齐。
  Improved transparency of the 30-day tag trend page. The subtitle now states the tag scope (top tags by new articles in the last 30 days), the exact statistics window dates, and that deleted articles are excluded, making it easier to reconcile with manual counts in the Statistics list.
- 优化增量扫描中断后的继续行为。继续未完成的增量扫描时，程序按任务启动时保存的各标签基准日期继续增量补扫，越过中断点补齐断档区间，不再对整个分类目录全量重扫；支持多次中断后链式继续。
  Improved resuming of interrupted incremental scans. When continuing an unfinished incremental scan, We2ima reuses the per-tag baseline dates saved when the task started, scanning incrementally past the interruption point to fill the gap instead of re-scanning the whole category from the top; chained resumes after repeated interruptions are supported.
- 优化自动更新流程的下载体验与状态反馈。检测到新版本后自动在后台预下载安装包，状态栏分阶段提示“下载中 / 已准备好 / 下载失败”；版本更新弹窗实时显示下载进度与速度；下载失败自动重试，仍失败时引导前往产品官网手动下载；下载速度较慢时提示可切换其他下载源手动下载。
  Improved the automatic-update download experience and status feedback. When a new version is detected, the installer is pre-downloaded in the background while the status bar shows staged messages (“downloading / ready / download failed”); the update dialog shows live download progress and speed; failed downloads are retried automatically, and if all attempts fail the app directs you to download manually from the official website, with guidance to try alternative download sources when the download is slow.
- 优化“使用URL打开文章”模式的文章链接获取方式。改为在微信内置查看器中经“更多 → 复制链接”自动获取微信官方短链，全程界面自动化按名称定位，不再需要“复制链接”菜单位置校准；短链与手机端、浏览器导入的文章链接形态一致，ima 知识库可按链接正确去重；未满足前置条件（微信未取消勾选“使用系统默认浏览器打开网页”）时任务会停止并给出引导，调整后可从断点继续。
  Improved how article URLs are obtained in “Open Articles via URL” mode. URLs are now copied as official WeChat short links from the built-in WeChat viewer (“More → Copy Link”), located entirely by UI automation with no position calibration required; the short links match the URL form used by mobile and browser imports, so ima deduplicates correctly by URL. If the precondition is not met (the WeChat option “Open web pages with the system default browser” is still enabled), the task stops with step-by-step guidance and can be resumed from the breakpoint afterward.

### 🐛 修复 / Fixed

- 修复部分微信公众号文章因发布者信息识别不准确，导致已读悬浮标记无法正确显示的问题。
  Fixed read overlays not appearing correctly on some WeChat Official Account articles because publisher information was matched too narrowly.
- 修复直接关闭整个浏览器时，阅读标记可能没有保存为已读状态的问题。
  Fixed read-marker status loss when users closed the entire browser directly.
- 修复阅读标记中多个状态写入入口可能造成重复统计或状态不一致的问题。
  Fixed possible duplicate counts or inconsistent states when read-marker status could be written from multiple paths.
- 修复扫描或导入日期范围显示陈旧，导致用户看到的日期范围与数据库状态不一致的问题。
  Fixed stale scan/import date-range display that could become inconsistent with the current database state.
- 修复设置页语言、主题选择框在部分场景下显示旧值或显示名不匹配的问题。
  Fixed Settings language and theme selectors showing stale values or mismatched display names in some cases.
- 修复启动阶段语言回调过早触发时，可能出现状态栏相关异常的问题。
  Fixed startup exceptions that could occur when language callbacks ran before the status bar was fully initialized.
- 修复后台线程调度 UI 更新时，可能在启动期产生 Tk 异常的问题。
  Fixed Tk scheduling exceptions that could occur when background threads requested UI updates during startup.
- 修复点击“扩展插件位置”浏览按钮后程序永久无响应的问题。
  Fixed the extension-folder Browse button leaving the app permanently unresponsive.
- 修复导入任务异常中断（如微信异常退出）后断点未保存、快慢速导入窗口恢复行为不一致的问题，统一为三次窗口恢复并引入结构化任务终态与文章级安全断点。
  Fixed breakpoint loss and inconsistent fast/slow-mode window recovery after abnormal import interruption (e.g. WeChat crash); unified to three-attempt window recovery with a structured task outcome and per-article safe checkpoints.
- 修复首次使用前提示弹窗在支付服务器不可达时，社群二维码区域停在“服务器连接失败”而始终不显示二维码的问题。服务器不可达时改为从产品官网兜底地址直接加载社群二维码图片，服务器可达时仍优先使用服务器下发地址。
  Fixed the first-use readiness dialog showing only “Server connection failed” and never displaying the community QR code when the payment server was unreachable. When the server is unreachable, the QR image is now loaded from a product-website fallback URL; when reachable, the server-configured URL still takes priority.
- 修复首次使用前提示弹窗社群二维码区域标题文案较长时单行溢出、被裁剪无法完整显示的问题，标题现已按区域宽度自动换行完整显示。
  Fixed the first-use readiness dialog’s community QR area title overflowing and being clipped when the title text was long; the title now wraps to fit the QR area width and displays in full.
- 修复 Chrome 页面缩放或 Windows DPI 坐标空间变化时，IMA 目录真实鼠标点击发生比例偏移或鼠标未移动的问题。
  Fixed scaled or unmoved real-mouse clicks on IMA directory items when Chrome page zoom or Windows DPI changed the coordinate space.
- 修复 Chrome 50% 页面缩放的合法视口数据被误判为无效，导致目录定位失败并错误提示升级 IMA 扩展的问题。
  Fixed valid viewport geometry at 50% Chrome zoom being rejected, which could prevent directory targeting and incorrectly show an IMA extension upgrade warning.
- 修复正常文章标题包含“Chrome DevTools Protocol”或“ima.copilot”时，文章窗口可能被误判为辅助窗口而无法导入的问题。
  Fixed normal article titles containing “Chrome DevTools Protocol” or “ima.copilot” being mistaken for auxiliary windows and failing to import.
- 修复 Chrome“翻译此页？”等辅助窗口可能被误选为文章主窗口，进而引发坐标失败或错误扩展升级提醒的问题。
  Fixed Chrome auxiliary windows such as “Translate this page?” being selected as the article window, which could cause coordinate failures or a false extension-upgrade warning.
- 修复快速或慢速导入中按 `Alt+P` 后仍继续弹出并点击 IMA 扩展的问题；暂停期间按 `Alt+Q` 仍可立即停止任务。
  Fixed fast or slow imports continuing to open and click the IMA extension after `Alt+P`; `Alt+Q` still stops immediately while paused.
- 修复自动导入、快速导入、恢复任务和全自动任务打开文章时可能误创建阅读 session、污染已读记录与阅读统计的问题。自动化运行时默认不记录，暂停或清理后仅在用户明确滚动、点击或按键阅读时创建 session。
  Fixed automatic imports, fast imports, resumed tasks, and Full Auto tasks potentially creating read sessions and polluting read history or statistics. Automated opens are suppressed by default, while explicit scrolling, clicking, or key activity after pause or cleanup can still start a session.
- 修复“30日标签趋势”按全历史文章总量选取 Top 20 标签，导致近 30 天有新增文章的标签被挤出列表、统计展示不全的问题；现按近 30 天新增文章数选取 Top 20，近 30 天无新增的标签不再占位，两个子页使用同一标签集合。
  Fixed 30-Day Tag Trends selecting the Top 20 tags by all-time article count, which pushed tags with recent additions out of the list and made the 30-day chart incomplete. Tags are now selected by new-article count within the last 30 days, tags without recent additions no longer occupy slots, and both tabs share the same tag set.
- 修复扫描任务中按住 Alt+P 稍久会被键盘自动重复反复抵消，导致暂停“经常失效”的问题；暂停快捷键改为松开按键时触发，每次按压恰好切换一次。
  Fixed scan pausing often appearing to fail because holding Alt+P slightly longer let keyboard auto-repeat toggle pause back and forth; the pause hotkey now fires on key release, so each physical press toggles exactly once.
- 修复扫描完成或停止后，在同一对话框中继续扫描时 Alt+P/Alt+Q 完全失效的问题。
  Fixed Alt+P/Alt+Q being completely unregistered when a scan was restarted from the same dialog after the previous scan finished or was stopped.
- 修复扫描中暂停响应延迟（需等当前批次文章处理完才暂停）、日期快速跳转阶段 Alt+Q 无法停止，以及暂停恢复瞬间可能跳过窗口状态恢复的问题。
  Fixed delayed pause response during scanning (pausing only took effect after the current batch of articles finished), Alt+Q not stopping during fast date jumps, and a resume race that could skip window-state recovery.
- 修复增量扫描中断后继续会把中断分类（如“链接”）从头全量重扫的问题；修复微信异常退出导致的中断会被误记为“已完成”的问题。
  Fixed interrupted incremental scans re-scanning the entire interrupted category (such as "Links") from the top when resumed, and fixed interruptions caused by abnormal WeChat exits being misrecorded as completed.
- 修复部分场景下 IMA 扩展被误报“未响应/版本过低”，导致导入任务被错误终止的问题（典型场景：文章已在默认目录、仅需导入目标标签目录）。
  Fixed the IMA extension being falsely reported as “unresponsive/outdated” in some scenarios, which aborted import tasks (a typical case: the article was already in the default directory and only the target tag directory still needed importing).
- 修复自动更新 manifest 验签失败时，“自动升级”按钮一直禁用且界面与日志均无任何错误提示的问题；更新签名工具与服务端 manifest 构造逻辑已统一，验签失败时更新弹窗会明确显示失败原因。
  Fixed auto-update signature verification failures leaving the “Upgrade automatically” button permanently disabled with no error shown in the UI or logs; the update signing tool now builds the manifest exactly as the server does, and verification failures are shown explicitly in the update dialog.
- 修复默认浏览器不是 Chrome 时，“使用URL打开文章”模式可能找不到 Chrome（尤其是用户级安装的 Chrome），导致文章无法打开、重试后被误标跳过的问题。
  Fixed “Open Articles via URL” mode failing to find Chrome when the default browser was not Chrome (especially per-user Chrome installs), which prevented articles from opening and caused them to be wrongly marked as skipped after retries.
- 修复目标文章出现在收藏列表视窗底部时，右键菜单向上弹出导致“复制链接”点空、文章被误标跳过的问题；现会先将其滚动至视窗中上部再进行点击或右键操作，列表尾部文章则滚动到列表底部后操作。
  Fixed the right-click menu popping upward when the target article was in the bottom rows of the favorites viewport, causing the “Copy Link” click to miss and the article to be wrongly marked as skipped; such articles are now scrolled to the upper-middle of the viewport first, while articles at the very end of the list are handled after scrolling to the bottom.
- 修复同一篇文章经不同方式导入 ima 知识库时出现重复条目的问题：URL 打开模式此前取得的长链与手机端导入保存的短链形态不同，导致 ima 按链接去重失效；现统一为微信官方短链，重复导入问题根治。
  Fixed duplicate entries in the ima knowledge base when the same article was imported through different channels: URL-open mode previously captured long links whose form differed from the short links saved by mobile imports, defeating ima’s URL-based deduplication; official WeChat short links are now used consistently, eliminating duplicate imports.
- 修复已在 ima 知识库中的文章在 URL 打开模式下未被识别，导致 ima 菜单被重复点击（先移除再收藏）的问题；URL 打开模式与点击打开模式现已共用同一套已导入检测管线，已导入文章直接跳过、菜单零点击。
  Fixed articles already present in the ima knowledge base not being recognized in URL-open mode, which caused the ima menu to be clicked twice (removed, then re-collected); URL-open mode and click-open mode now share the same already-imported detection pipeline, and already-imported articles are skipped with zero menu clicks.
- 修复 URL 打开前置条件不满足时的引导弹窗可能重复弹出两次的问题。
  Fixed the guidance dialog for unmet URL-open preconditions potentially popping up twice.
- 修复公众号名称含空格的文章在 URL 打开模式下可能定位失败、且失败后无重试、无记录静默跳过的问题；定位失败现会按预算重试，最终失败会进入任务报告并标记跳过。
  Fixed articles whose publisher name contains spaces failing to locate in URL-open mode, and silently disappearing with no retry and no record; locating failures are now retried within the retry budget, and final failures appear in the task report and are marked as skipped.
- 修复文章未加载完成时打开查看器菜单可能缺少“复制链接”条目，导致查看器被重复打开两次的问题；现会等待页面加载完成后再打开菜单，菜单缺项时在同一查看器内关闭菜单后自动重试。
  Fixed the viewer menu missing the “Copy Link” item when opened before the article finished loading, which caused the viewer to be opened twice per article; the menu now opens only after the page has loaded, and a menu missing the item is closed and retried within the same viewer.
- 修复默认浏览器不是 Chrome 时“扫描ima导入目录列表”获取目录失败的问题，现会自动经微信内置查看器取得文章链接并强制使用 Chrome 打开；同时修复收藏夹顶部文章不是公众号文章时该功能直接报错的问题，现会弹出 5 秒后自动消失的提示并自动尝试后续文章，直到找到可用于获取目录列表的公众号文章。
  Fixed “Scan ima Import Directory List” failing when the default browser was not Chrome — the article link is now obtained via the built-in WeChat viewer and forcibly opened in Chrome; also fixed the feature erroring out when the top favorites article was not an Official Account article — a prompt that auto-dismisses after 5 seconds is now shown and the next articles are tried automatically until one usable for retrieving the directory list is found.
- 修复打包版软件启动时偶发弹出“Failed to load Python DLL”报错导致无法启动、退出时偶发弹出“Failed to remove temporary directory”报错的问题。根因是软件每次启动解压的临时目录被杀毒软件实时扫描锁定、退出时清理失败，残留目录长期累积后与新启动进程冲突；现启动时会自动清理 24 小时前的历史残留解压目录（正在使用中的目录安全跳过），退出时等待后台组件完全释放文件句柄，并通过主程序单实例运行约束、关闭启动器 UPX 压缩阻断新的残留产生，故障率随使用收敛而非恶化。
  Fixed the packaged build occasionally failing to start with a “Failed to load Python DLL” error, and occasionally showing a “Failed to remove temporary directory” error on exit. Root cause: the temporary extraction directory created on every launch could be locked by antivirus real-time scanning and fail to be removed on exit, so leftover directories accumulated over time and eventually collided with new processes; the app now automatically purges stale extraction directories older than 24 hours at startup (directories still in use are skipped safely), waits for background components to fully release file handles on exit, and prevents new leftovers through a single-instance constraint on the main app and disabled UPX compression for the launcher — the failure rate now converges with use instead of growing.

### 📝 提示 / Notes

- 自动更新完成浏览器扩展升级后，需要重启浏览器，或打开 `chrome://extensions/` 刷新对应扩展，才能启用新版扩展功能。
  After browser extensions are updated automatically, restart the browser or open `chrome://extensions/` and refresh the updated extensions to enable the new extension features.
- 如果自动更新不可用或缺少独立更新程序，仍可前往官网下载完整发布包进行手动更新。
  If automatic update is unavailable or the standalone updater is missing, users can still download the full release package from the official website and update manually.
- 扫描和导入日期范围支持自动纠正日期顺序，但日期为空或格式无效时，仍需要用户手动补全或修改。
  Date-range order is corrected automatically for scan and import flows, but empty or invalid dates still need to be completed or corrected manually.
- 阅读标记状态已增强异常关闭场景的保留能力，但浏览器扩展仍需正常启用，文章页也需要允许扩展运行。
  Read-marker recovery for abnormal browser exits is improved, but the browser extension still needs to be enabled and allowed to run on article pages.
- 阅读标记扩展需升级并重新加载到 `0.1.1`；旧版本会显示升级提示，且不会按新的自动导入来源隔离规则运行。升级步骤见 [阅读标记扩展升级指导](https://www.we2ima.com/guides/read-marker-extension-upgrade/)。
  Upgrade and reload the read-marker extension to `0.1.1`. Older versions show an upgrade notice and do not follow the new import-source isolation rules. See the [read-marker extension upgrade guide](https://www.we2ima.com/guides/read-marker-extension-upgrade/) for step-by-step instructions (Chinese).
- 扩展目录选择器只允许选择本地现有目录，不支持网络路径、映射网络盘和符号链接；如需选择这些位置，请先将扩展复制到本地固定盘。
  The extension-directory picker only accepts existing local directories; network paths, mapped network drives, and symbolic links are not supported. Copy the extension to a local fixed drive first if needed.
- 老用户升级后无需手动迁移，“从上次中断处继续”断点记录会自动兼容新版恢复逻辑。
  Existing users do not need manual migration; resume checkpoints are auto-compatible with the new recovery logic.
- v1.0.4 要求当前实际运行的 IMA 优化版扩展版本不低于 `1.1.3.1`。如果只替换主程序，请按 [IMA 扩展升级指导](https://www.we2ima.com/guides/ima-extension-upgrade/) 重新加载或安装新版扩展。
  v1.0.4 requires the IMA optimized extension currently running in Chrome to be version `1.1.3.1` or later. If you replace only the main executable, follow the [IMA extension upgrade guide](https://www.we2ima.com/guides/ima-extension-upgrade/) to reload or install the new extension.
- IMA 坐标自适应当前仅承诺单显示器场景；多显示器、跨屏移动、不同屏幕 DPI 或任务中动态改变窗口/显示环境暂不支持。
  IMA coordinate adaptation currently supports single-monitor configurations only. Multi-monitor setups, cross-screen movement, mixed per-monitor DPI, and changing the window/display environment during a task are not supported.
- 实验性 DOM 点击默认关闭；DOM 路径失败时不会自动回退到真实鼠标，以避免同一目录被重复点击。
  Experimental DOM clicking is disabled by default. If the DOM path fails, We2ima does not fall back to a real-mouse click, preventing duplicate clicks on the same directory.
- 扫描与导入的暂停快捷键 Alt+P 在松开按键时生效；正常点按与之前体验一致，按住不放不再反复触发暂停/恢复切换。
  The Alt+P pause hotkey for scans and imports now takes effect when the key is released; normal quick presses feel the same as before, and holding the key no longer toggles pause repeatedly.
- 从旧版本升级后，数据库会自动补齐扫描基准所需字段，无需手动迁移；升级前遗留的未完成扫描记录仍按原方式（全量补扫）继续，升级后新产生的增量扫描中断按新的基准逻辑继续。
  After upgrading, the database gains the fields required for scan baselines automatically — no manual migration needed. Unfinished scans left over from older versions still resume with the previous full re-scan behavior; incremental scans interrupted after the upgrade resume with the new baseline logic.
- 套餐折扣由服务器配置下发；客户端展示划线原价与折后价，实际扣款以服务器计算的折后价为准，支付弹窗只显示实付金额。
  Plan discounts are configured on the server; the client shows the strikethrough list price and sale price, the charged amount is the discounted price calculated by the server, and the payment dialog shows only the final amount due.
- 季付套餐需 v1.0.4 及以上版本客户端支持；旧版本客户端无法识别和激活季付激活码，请先升级到最新版本。调整后的套餐价格以支付服务器实时目录为准。
  The Quarterly plan requires We2ima v1.0.4 or later; older clients cannot recognize or activate Quarterly activation codes — please upgrade first. Adjusted plan prices always follow the payment server's live catalog.
- 已知限制：导入任务运行期间请勿同时执行扫描任务，两者会同时注册暂停/停止快捷键导致状态错乱；请先停止导入任务再进行扫描。
  Known limitation: do not run a scan while an import task is running — both tasks would register the same pause/stop hotkeys and their states can conflict; stop the import task before scanning.
- 默认浏览器不是 Chrome 的用户无需修改系统默认浏览器，只需安装 Chrome，并在微信“设置 → 通用设置”中取消勾选“使用系统默认浏览器打开网页”；软件启动时会自动开启“使用URL打开文章”模式，前置条件未满足时任务会停止并给出引导。
  If your default browser is not Chrome, you do not need to change the system default browser — just install Chrome and, in WeChat “Settings → General Settings”, uncheck “Open web pages with the system default browser”. We2ima enables the “Open Articles via URL” mode automatically at launch; if the precondition is not met, the task stops with guidance.
- “使用URL打开文章”模式不再需要“复制链接”菜单位置校准，查看器菜单由界面自动化按名称直接定位；此前完成的校准数据保留备用，不影响使用。
  “Open Articles via URL” mode no longer requires “Copy Link” menu-position calibration — viewer menus are located directly by UI automation using element names; any previously completed calibration data is kept as a fallback and does not affect usage.
- 若你在 2026-08-31 之前下载的 v1.0.4 安装包遇到“自动升级到新版本”按钮不可用或自动下载安装包失败，请前往产品官网下载页重新下载最新安装包手动更新。
  If a v1.0.4 installer downloaded before 2026-08-31 shows an unavailable “Upgrade automatically” button or fails to download the update package, please download the latest installer again from the official download page and update manually.
- 打包版主程序不支持双开：重复启动时会提示“程序已在运行，请检查系统托盘”并自动退出。注意关闭主窗口默认是最小化到系统托盘而非退出程序，此时再次双击桌面图标会收到上述提示，属正常行为。
  The packaged main app no longer allows multiple instances: a second launch shows “We2ima is already running. Please check the system tray.” and exits automatically. Note that closing the main window minimizes the app to the system tray instead of quitting, so double-clicking the desktop icon again shows this message — this is expected behavior.
- 若杀毒软件实时扫描导致软件启动失败（如 360、Windows Defender），建议将主程序加入信任列表：Defender 用户可在“病毒和威胁防护 → 排除项 → 进程”中添加 We2ima.exe；360 用户可在信任区添加软件安装目录及主程序文件。
  If antivirus real-time scanning (e.g. 360, Windows Defender) blocks the app from starting, add the main executable to the trust list: for Defender, add We2ima.exe under “Virus & threat protection → Exclusions → Processes”; for 360, add the installation directory and the main executable to the trusted zone.

---

## [1.0.3] - 2026-07-12

本次更新新增微信公众号文章下载与公众号已读标记能力，并加强旧版本升级兼容、阅读标记稳定性、版本提示和后台使用统计。
This update adds WeChat Official Account article downloading and read-status marking, while improving upgrade compatibility, read-marker stability, release notices, and backend usage analytics.

### ✨ 新增 / Added

- 新增“公众号下载”功能，可批量下载微信公众号文章，并保存为 Markdown 与 MHTML 文件，方便本地归档、整理和后续阅读。
  Added WeChat Official Account Article Download, allowing users to batch download articles and save them as Markdown and MHTML files for local archiving and reading.
- 新增“公众号已读标记”功能，可识别公众号文章阅读状态，并在微信收藏夹文章列表中显示已读提示。
  Added WeChat Official Account Read Marker, which detects article reading status and shows read indicators in WeChat Favorites article lists.
- “公众号已读标记”功能配套“统计与管理”页面，可查看已读文章、阅读时间、公众号统计和阅读概览。
  Added read-marker statistics and management pages for read articles, reading time, publisher statistics, and reading overview.
- 新增 v1.0.3 新版本功能提示弹窗，帮助新用户和升级用户了解当前版本新增能力。
  Added a v1.0.3 release notice dialog so new and upgraded users can quickly understand the new capabilities.

### 💡 优化 / Improved

- 优化旧版本升级兼容。v1.0.0、v1.0.1、v1.0.2 用户升级到 v1.0.3 时，会自动补齐新配置项，并在需要迁移旧数据库结构前创建备份。
  Improved upgrade compatibility for users upgrading from v1.0.0, v1.0.1, or v1.0.2. New settings are backfilled automatically, and database backups are created before required legacy-schema migrations.
- 优化构建与打包配置，确保新增模块、扩展资源、依赖和版本信息能进入发布包。
  Improved build and packaging configuration so new modules, extension assets, dependencies, and version metadata are included in release builds.

### 🐛 修复 / Fixed

- 修复导入任务自动打开公众号文章时，阅读标记可能误判为用户已读的问题。自动导入期间不会写入已读记录；用户暂停导入并继续阅读时仍可正常记录。
  Fixed read-marker records being incorrectly created when the import task automatically opens WeChat articles. Auto-opened import pages are no longer counted as user reading; if the user pauses the import task and keeps reading, the article can still be recorded normally.
- 修复旧版主数据库缺少 `day_order` 等字段时，升级初始化可能先创建索引而失败的问题。
  Fixed legacy main-database upgrades that could fail when indexes were created before missing fields such as `day_order` were added.
- 修复数据库迁移备份文件可能反复创建的问题，减少重复备份噪声。
  Fixed repeated creation of database migration backup files.
- 修复部分新增功能在打包后可能因模块或资源未注册而无法加载的风险。
  Fixed packaging risks where newly added modules or resources could be missing from release builds.

### 📝 提示 / Notes

- “公众号下载”适合用于本地备份微信公众号文章。下载结果会保存为 Markdown 与 MHTML，实际效果可能受原文章页面结构、图片加载和网络环境影响。
  WeChat Article Download is intended for local backup of WeChat Official Account articles. Markdown and MHTML output may vary depending on article structure, image loading, and network conditions.
- “公众号已读标记”需要配合本地服务与 Chrome 扩展使用，只在本机记录和展示阅读状态。
  WeChat Read Marker works with a local service and Chrome extension. Reading status is recorded and displayed locally on the user's machine.
- 如果正在运行自动导入任务，程序会尽量避免把自动打开的文章误记为已读；暂停导入任务后继续阅读当前文章，则可按人工阅读记录。
  During automated import tasks, We2ima avoids marking auto-opened articles as read. If the task is paused and the user continues reading the current article, it can be treated as manual reading.
- 老用户首次升级到 v1.0.3 时，程序可能会创建配置或数据库迁移备份，这是为了保护旧版本数据。
  When upgrading to v1.0.3 for the first time, the app may create settings or database migration backups to protect older user data.

---

## [1.0.2] - 2026-07-02

本次更新聚焦本地客户端导入效率、部分结构文章导入稳定性、导入模式灵活性、扫描可靠性、调试流程、全量重试可靠性和新用户上手体验提示。
This update focuses on local-client import efficiency, WeChat article import stability, import mode flexibility, favorites scanning reliability, debugging workflows, full reprocessing reliability, and first-run onboarding.

### ✨ 新增 / Added

- 快速导入实验功能，可减少单篇文章导入等待时间，同时保留必要等待与重试机制。
  Experimental Fast Import to reduce per-article import waiting time while retaining necessary waits and retries.
- 仅浏览器打开模式：关闭 "启用IMA 导入"功能后，可测试文章定位与浏览器打开链路，不会把文章标记为“已导入 IMA”。
  Browser Open Mode for testing article locating and browser opening without marking articles as imported into IMA when IMA import is disabled.
- 仅浏览器打开模式配置独立历史记录、统计展示与调试额度支持，方便区分“已打开到浏览器”和“已导入 IMA”的文章状态。
  Browser Open Mode configuration separate history, statistics, and debug quota support to distinguish browser-opened articles from real IMA imports.
- 首次启动上手提示弹窗，在使用引导前提示环境准备和首次配置注意事项，并提供飞书使用沟通群入口。
  First-run onboarding readiness dialog with setup reminders and a Feishu user community entry before the usage guide.

### 💡 优化 / Improved

- 快速导入、正常 IMA 导入、仅浏览器打开模式按独立语义运行，减少状态混淆。
  Fast Import, normal IMA import, and Browser Open Mode now run with clearer state separation to reduce mixed records.
- 导入模式拆分为“导入范围”和“处理方式”，可组合“从头开始、从指定位置开始、指定日期范围”、与“跳过已处理和全部处理”等策略。
  Import mode settings now separate import range from processing behavior, allowing combinations of From Top, From Position, Date Range, Skip Processed, and Process All.
- “仅处理新文章”改为独立开关，“从上次中断处继续”改为独立恢复按钮和弹窗，减少模式含义混淆。
  Only New is now an independent switch, while Resume From Last Stop is a separate recovery button and dialog to reduce mode ambiguity.
- 定时任务和全自动任务的启动模式展示与保存逻辑优化，新旧任务配置会按实际执行策略展示。
  Scheduled-task and full-auto-task start mode display and persistence now show both new and legacy task settings according to the actual execution strategy.
- 优化微信公众号部分结构文章导入不稳定问题，降低导入失败概率。
  Optimize the instability of the structure import of some articles on WeChat official account, and reduce the probability of import failure.
- 优化 Chrome 文章窗口识别，减少窗口标题自动定位失败。
  Optimize Chrome article window recognition to reduce automatic window title localization failures.
- 收藏标签扫描逻辑优化，仅包含视频、图片等非文章收藏的标签页会正常结束并继续后续标签，不再误报断连。
  Improved favorites scanning so tags containing only videos, images, or other non-article items finish normally and continue to later tags instead of reporting a disconnect.

### 🐛 修复 / Fixed

- 修复临时导入失败被误标记为永久 Skip 的问题，后续任务可重新尝试。
  Fixed transient import failures being incorrectly saved as permanent Skip states, allowing later retries.
- 修复“从头开始（全部处理）”模式，确保所有历史状态文章都可重新尝试处理，并保持数据库状态归一化。
  Fixed “From Top (Process All)” mode so all historical article states can be retried, and maintain the normalization of the database status.
- 修复“从指定位置开始 + 全部处理”和“指定日期范围 + 全部处理”无法稳定表达或执行的问题。
  Fixed From Position + Process All and Date Range + Process All so these combinations can be represented and executed reliably.
- 修复旧版定时任务、全自动任务和中断恢复记录在新版启动模式下可能展示不一致或执行范围错误的问题。
  Fixed legacy scheduled tasks, full-auto tasks, and resume records that could otherwise display inconsistently or run with the wrong import range after the new start mode model.
- 修复“仅处理新文章”在反向导入、日期范围游标和仅浏览器打开模式下可能提前停止或方向错误的问题。
  Fixed Only New edge cases with reverse direction, date-range cursors, and Browser Open Mode that could stop too early or use the wrong direction.
- 修复全自动子任务空 limit 或非正数参数可能保存后到执行阶段才崩溃的问题。
  Fixed full-auto subtasks saving empty or non-positive limit values that could otherwise fail later during execution.
- 修复导入任务报告弹窗可能被浏览器窗口遮挡的问题，现在弹窗默认置顶显示。
  Fixed the import task report dialog possibly being hidden behind browser windows; it now opens topmost by default.
- 修复多Tag导入模式下，“批次数量”计算层级问题。
  Fixed the issue of calculating the hierarchy of "batch quantity" in multi Tag import mode.
- 修复ima自动定位点击时，鼠标漂移或异常移动导致任务中断。
  Fixed the task interruption caused by mouse drift or abnormal movement during ima automatic positioning and clicking.

### 📝 提示 / Notes

- 仅浏览器打开不代表文章已导入 IMA 知识库。
  Browser Open Mode does not mean the article has been imported into the IMA knowledge base.
- “从上次中断处继续”现在是恢复动作，不再作为普通启动模式保存到定时任务或全自动任务中；旧任务会自动按兼容规则迁移。
  Resume From Last Stop is now a recovery action, not a normal saved start mode for scheduled or full-auto tasks. Legacy tasks are migrated automatically.
- 如需重新处理已导入、Skip、Deleted 或仅浏览器打开过的文章，请在对应导入范围下选择“全部处理”。
  To retry imported, skipped, deleted, or browser-opened-only articles, choose Process All under the desired import range.
- 快速导入属于实验功能，慢加载网页或扩展响应较慢时仍可能触发额外等待或重试。
  Fast Import is experimental; slow-loading pages or delayed extension responses may still trigger extra waits or retries.
- 微信公众号部分结构文章如果遇到插件或页面状态临时超时，会作为本次失败记录，不再默认变成永久跳过；后续可重新运行任务尝试。
  If a newer WeChat article temporarily times out during import, it is treated as a retryable failure instead of a permanent skip.
- 首次使用如果遇到环境配置或插件安装问题，可根据启动提示加入飞书使用沟通群求助。
  If first-time setup or plugin installation is difficult, use the startup prompt to join the Feishu user community for help.
---

## [1.0.1] - 2026-06-12

v1.0 系列首个优化迭代,聚焦扫描稳定性、按日期范围扫描、用户体验及bug修复。
First post-release iteration focused on scan stability, date-range scanning, user experience and bug fixes.

### ✨ 扩展 / Added

- 按日期范围扫描
  Date-range scanning
- 未完成扫描查看与继续(中断后可一键续扫剩余标签)
  Resume incomplete scans (one-click continue on remaining tags)
- 导入任务完成弹出详细报告
  Detailed import-task report on completion
- 支付成功页与种子用户活动新增飞书用户社群二维码
  Lark (Feishu) community QR code on payment success page and seed-user activity
- 软件版本升级提示功能
  Software version upgrade notification feature

### 💡 优化 / Improved

- 扫描延迟可在设置页自由调整(白天/夜间双档)
  Scan delays configurable in Settings (day/night dual-tier)
- 扫描任务中快捷键 (Alt+P 暂停 / Alt+Q 停止)响应优化
  Optimization of shortcut key responses (Alt+P to Pause / Alt+Q to Stop) in scanning tasks
- 设置页布局重构
  Set page layout refactoring
- 慢速扫描延迟随机化
  Slow-scan delays randomized

### 🐛 修复 / Fixed

- 修复“自定义快捷键”即时生效问题
  The issue of "custom shortcut keys" taking immediate effect
- 修复“恢复默认设置”问题
  The issue of 'restoring default settings'
- 修复"按日期范围"模式的 3 类边界判定问题
  3 boundary issues in date-range scanning mode
- 修复多标签增量扫描场景下的早停回归
  Early-stop regression in incremental multi-tag scanning
- 修复"链接"标签在 ima 目录匹配徽章上的显示异常
  "Link" tag's ima-folder matching badge display anomaly
- 修复微信异常退出后任务被误判为"扫描完成"的问题
  Tasks incorrectly marked "scan complete" after abnormal WeChat exit

---

## [1.0.0] - 2026-05-05

首次公开发布 / Initial public release.

- 支持 6 种导入模式
  6 import modes (skip processed, full, resume, position, date range, new only)
- 收藏夹快速扫描与去重
  Fast favorites scan with deduplication
- 智能断点续传,支持暂停/恢复
  Smart resume from breakpoint with pause/resume
- 日期范围筛选导入
  Date-range filtering
- 统计面板与导入历史
  Statistics dashboard and import history
- 中英文双语界面
  Bilingual UI (Chinese / English)
- 纯本地运行,零数据收集
  Pure local operation, zero data collection
