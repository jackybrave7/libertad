# ============================================================
#  IR Actor Tracker — TouchDesigner Network Builder
#  Каменное сердце / Короткофокусный проектор + ИК камера
#
#  Как запустить:
#  1. Открой TouchDesigner
#  2. Alt+T — открой Textport
#  3. Вставь весь этот файл и нажми Enter
#     ИЛИ: создай Text DAT, вставь код, нажми ПКМ → Run Script
# ============================================================

def build_ir_tracker():
    root = op('/project1')

    # ── Удалить старый контейнер если есть ─────────────────
    old = root.op('IR_Tracker')
    if old:
        old.destroy()

    # ── Создать контейнер ──────────────────────────────────
    base = root.create(baseCOMP, 'IR_Tracker')
    base.nodeX, base.nodeY = 0, 0
    p = base  # короткая ссылка

    # ═══════════════════════════════════════════════════════
    # БЛОК 1: КАМЕРА И ВЫДЕЛЕНИЕ ИК ТОЧКИ
    # ═══════════════════════════════════════════════════════

    # Камера
    cam = p.create(videodeviceinTOP, 'cam')
    cam.nodeX, cam.nodeY = -1000, 300
    cam.par.width  = 640
    cam.par.height = 480
    cam.par.rate   = 60
    # !! После запуска: выбери свою ИК камеру в параметре "Device"

    # Перевод в ч/б (ИК камеры часто дают цветной сигнал)
    mono = p.create(monoTOP, 'mono')
    mono.nodeX, mono.nodeY = -800, 300
    mono.inputConnectors[0].connect(cam)
    mono.par.mono = 'r'  # берём только красный канал (ИК ближе к красному)

    # Поднять контраст — сделать ИК пятно ярче
    level = p.create(levelTOP, 'levels')
    level.nodeX, level.nodeY = -600, 300
    level.inputConnectors[0].connect(mono)
    level.par.contrast   = 4.0   # ↑ если пятно плохо видно
    level.par.gamma      = 0.4
    level.par.blacklevel = 0.75  # ↑ чтобы убрать фон

    # Порог — оставить только самые яркие пиксели (ИК диод)
    thresh = p.create(thresholdTOP, 'thresh')
    thresh.nodeX, thresh.nodeY = -400, 300
    thresh.inputConnectors[0].connect(level)
    thresh.par.threshold = 0.92  # подбирается под условия съёмки

    # Размытие — убрать шумовые пиксели
    blur = p.create(blurTOP, 'blur')
    blur.nodeX, blur.nodeY = -200, 300
    blur.inputConnectors[0].connect(thresh)
    blur.par.size = 7

    # Analyze TOP — находит центр масс яркого пятна (luminance centroid)
    # Выходной пиксель 1x1: R = X позиция (0..1), G = Y позиция (0..1)
    analyze = p.create(analyzeTOP, 'centroid')
    analyze.nodeX, analyze.nodeY = 0, 300
    analyze.inputConnectors[0].connect(blur)
    analyze.par.function = 'luminancecentroid'

    # Монитор камеры (для отладки)
    out_cam = p.create(outTOP, 'out1_debug_cam')
    out_cam.nodeX, out_cam.nodeY = 0, 500
    out_cam.inputConnectors[0].connect(blur)

    # ═══════════════════════════════════════════════════════
    # БЛОК 2: ПОЛУЧЕНИЕ КООРДИНАТ КАК CHOP
    # ═══════════════════════════════════════════════════════

    # TOP → CHOP: из 1x1 пикселя Analyze получаем каналы r, g (= tx, ty)
    top2chop = p.create(topCHOP, 'top_to_chop')
    top2chop.nodeX, top2chop.nodeY = 0, 100
    top2chop.par.top = 'centroid'

    # Переименовать каналы в понятные tx, ty
    rename = p.create(renameCHOP, 'rename_channels')
    rename.nodeX, rename.nodeY = 200, 100
    rename.inputConnectors[0].connect(top2chop)
    rename.par.renamefrom = 'r g'
    rename.par.renameto   = 'tx ty'

    # Сглаживание движения (убирает дрожание)
    filt = p.create(filterCHOP, 'smooth')
    filt.nodeX, filt.nodeY = 400, 100
    filt.inputConnectors[0].connect(rename)
    filt.par.width = 0.06     # 0.02 = быстро/резко, 0.15 = медленно/плавно
    filt.par.type  = 'gaussian'

    # Финальный выход позиции
    pos_out = p.create(nullCHOP, 'pos_out')
    pos_out.nodeX, pos_out.nodeY = 600, 100
    pos_out.inputConnectors[0].connect(filt)

    # ═══════════════════════════════════════════════════════
    # БЛОК 3: КОНТЕНТ И ПРОЕКЦИЯ
    # Прожектор-пятно, следует за актёром
    # ═══════════════════════════════════════════════════════

    # Чёрный фон (размер = разрешение проектора)
    bg = p.create(constantTOP, 'bg')
    bg.nodeX, bg.nodeY = -600, -200
    bg.par.colorr = 0.0
    bg.par.colorg = 0.0
    bg.par.colorb = 0.0
    bg.par.resolutionw = 1920
    bg.par.resolutionh = 1080

    # Форма прожектора (мягкий круг)
    circle = p.create(circleTOP, 'spotlight_shape')
    circle.nodeX, circle.nodeY = -400, -200
    circle.par.radius      = 0.18   # размер пятна (доля от высоты кадра)
    circle.par.edgesoftness = 0.4   # мягкость края
    circle.par.fillr       = 1.0
    circle.par.fillg       = 0.95
    circle.par.fillb       = 0.85
    circle.par.bgcolor     = 0
    circle.par.resolutionw = 1920
    circle.par.resolutionh = 1080

    # Transform — двигаем прожектор по позиции актёра
    # tx камеры 0..1 → translate X от -0.5 до +0.5
    # ty инвертируется (камера Y вниз, TD Y вверх)
    trans = p.create(transformTOP, 'follow')
    trans.nodeX, trans.nodeY = -200, -200
    trans.inputConnectors[0].connect(circle)
    trans.par.tx.expr = "op('pos_out')['tx'] - 0.5"
    trans.par.ty.expr = "0.5 - op('pos_out')['ty']"
    trans.par.extend  = 'zero'

    # Сложение: фон + прожектор
    comp = p.create(compositeTOP, 'comp')
    comp.nodeX, comp.nodeY = 0, -200
    comp.inputConnectors[0].connect(bg)
    comp.inputConnectors[1].connect(trans)
    comp.par.operand = 'add'

    # Выход на проектор
    out_proj = p.create(outTOP, 'out2_projector')
    out_proj.nodeX, out_proj.nodeY = 200, -200
    out_proj.inputConnectors[0].connect(comp)

    # ═══════════════════════════════════════════════════════
    # БЛОК 4: UI ПАРАМЕТРЫ (легко менять без лезть в ноды)
    # ═══════════════════════════════════════════════════════

    pages = base.appendCustomPage('Tracker Settings')

    p_thresh = pages.appendFloat('IRThreshold', label='IR Threshold')[0]
    p_thresh.default = 0.92
    p_thresh.min, p_thresh.max = 0.5, 1.0
    p_thresh.normMin, p_thresh.normMax = 0.7, 1.0
    thresh.par.threshold.expr = "op('..').par.IRThreshold"

    p_smooth = pages.appendFloat('Smoothing', label='Motion Smoothing')[0]
    p_smooth.default = 0.06
    p_smooth.min, p_smooth.max = 0.01, 0.5
    filt.par.width.expr = "op('..').par.Smoothing"

    p_radius = pages.appendFloat('SpotSize', label='Spotlight Size')[0]
    p_radius.default = 0.18
    p_radius.min, p_radius.max = 0.05, 0.5
    circle.par.radius.expr = "op('..').par.SpotSize"

    print("")
    print("╔══════════════════════════════════════════╗")
    print("║  IR Tracker — сеть нодов создана!        ║")
    print("╠══════════════════════════════════════════╣")
    print("║  Путь: /project1/IR_Tracker              ║")
    print("╠══════════════════════════════════════════╣")
    print("║  Следующие шаги:                         ║")
    print("║  1. cam → выбери ИК камеру (Device)      ║")
    print("║  2. Смотри out1_debug_cam — видна ли     ║")
    print("║     яркая точка ИК диода                 ║")
    print("║  3. IR_Tracker → Tracker Settings →      ║")
    print("║     подстрой IR Threshold                ║")
    print("║  4. out2_projector → назначь проектор    ║")
    print("║     (Window COMP или Performance Mode)   ║")
    print("╚══════════════════════════════════════════╝")


build_ir_tracker()
