document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');

    // Toggle mobile menu
    if (mobileBtn && mobileNav && mobileOverlay) {
        mobileBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            mobileBtn.classList.toggle('active');

            // Prevent body scroll when menu is open
            if (mobileNav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close mobile menu when clicking overlay
        mobileOverlay.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            mobileOverlay.classList.remove('active');
            mobileBtn.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.mobile-nav a, .nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            // Smooth scroll
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }

            // Close mobile menu if elements exist
            if (mobileNav && mobileOverlay && mobileBtn) {
                mobileNav.classList.remove('active');
                mobileOverlay.classList.remove('active');
                mobileBtn.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Optimized Scroll Handler (Handles both Navbar and Active Section Highlighting)
    let isScrolling = false;

    function handleScroll() {
        const scrollY = window.pageYOffset;

        // 1. Navbar scroll effect
        if (navbar) {
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // 2. Active section highlighting
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });

        isScrolling = false;
    }

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(handleScroll);
            isScrolling = true;
        }
    }, { passive: true });

    handleScroll(); // Initial check

    // Scroll Animation Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Observe Hero Elements
    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });

    // Observe Section Titles and Cards specific animation
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    const animatedElements = document.querySelectorAll('.concept-card, .cast-card, .system-box, .blog-card, .access-content');
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        el.style.transitionDelay = `${index % 3 * 0.1}s`; // Stagger effect
        cardObserver.observe(el);
    });

    // Form Submission Handlers
    const customerForm = document.getElementById('customerForm');
    const applicationForm = document.getElementById('applicationForm');

    if (customerForm) {
        customerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(customerForm);
            const data = Object.fromEntries(formData);
            
            fetch('http://localhost:8000/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(result => {
                alert('お問い合わせありがとうございます！\n内容を確認次第、ご連絡させていただきます。');
                customerForm.reset();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('送信に失敗しました。サーバーが起動しているか確認してください。');
            });
        });
    }

    if (applicationForm) {
        applicationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(applicationForm);
            const data = Object.fromEntries(formData);
            
            // Ensure age is an integer as expected by the backend
            if (data.age) {
                data.age = parseInt(data.age, 10);
            }

            fetch('http://localhost:8000/api/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(result => {
                alert('ご応募ありがとうございます！\n書類選考の結果は1週間以内にご連絡いたします。\n一緒に働けることを楽しみにしています♪');
                applicationForm.reset();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('送信に失敗しました。サーバーが起動しているか確認してください。');
            });
        });
    }

    // --- Translation Logic ---
    const translations = {
        ja: {
            nav_concept: "Concept", nav_guide: "Guide", nav_cast: "Cast", nav_system: "System",
            nav_events: "Events", nav_blog: "Blog", nav_access: "Access", nav_contact: "Contact",
            hero_badge: "Welcome to Wonderland",
            hero_title_1: "魔法と", hero_title_2: "夢の国へ", hero_title_3: "ようこそ",
            hero_subtitle: "秋葉原で一番可愛い<br>王道コンセプトカフェ",
            btn_system: "料金システムを見る", btn_access: "アクセス", btn_cast_list: "キャスト一覧を見る",
            title_concept: "コンセプト", title_guide: "楽しみ方ガイド", title_cast: "キャスト紹介",
            title_system: "システム・料金", title_events: "イベントスケジュール", title_blog: "メイド日誌",
            title_access: "アクセス", title_contact: "お問い合わせ",
            cast_list_title: "キャスト一覧", cast_list_p: "個性豊かなメイドたちが皆様のお帰りをお待ちしております♪",
            blog_list_title: "メイド日誌（ブログ）一覧", blog_list_p: "お屋敷での日常や最新情報をメイドたちが綴ります♪",
            sub_concept: "Our Story", sub_guide: "How to Enjoy", sub_cast: "Cast Members",
            sub_system: "Price List", sub_events: "What's Coming", sub_blog: "Maid Diary",
            sub_access: "Location", sub_contact: "Get in Touch",
            guide_desc: "初めての方でも安心！メイドカフェの楽しみ方をご紹介します",
            concept_p1: "扉を開ければ、そこは日常を忘れる魔法の世界。Magical Cafe ALICEは、アリスの不思議な国をイメージした王道コンセプトカフェです。",
            concept_p2: "可愛いメイドたちが、美味しいお茶と魔法のような時間をご用意して、ご主人様・お嬢様のお帰りをお待ちしております。心ゆくまで夢のひとときをお楽しみください。",
            concept_card1_title: "魔法の時間", concept_card1_desc: "扉を開ければそこは不思議の国。<br>日常を忘れて、特別な魔法の時間をお過ごしください。",
            concept_card2_title: "癒しの空間", concept_card2_desc: "可愛いお屋敷で、自慢の紅茶と手作りスイーツ。<br>メイドたちが心を込めてお給仕します。",
            concept_card3_title: "王道のおもてなし", concept_card3_desc: "「おかえりなさいませ」<br>秋葉原ならではの心温まる最高のおもてなしをお約束します。",
            charge_title: "チャージ料金 (60分)", charge_male: "男性", charge_female: "女性", charge_ext: "延長 (30分)", charge_note: "※ワンドリンクオーダー制となります",
            nomihodai_title: "飲み放題コース (60分)", nomihodai_soft: "ソフトドリンク", nomihodai_alc: "アルコール", nomihodai_set: "チェキ付きセット", nomihodai_note: "※チャージ料込みのお得なセットです！",
            food_title: "フード", food_note: "※他にも多数のフード・デザートメニューをご用意しております！",
            food_omurice: "魔法のオムライス（お絵かき付き）", food_pancake: "メイド特製ふわふわパンケーキ", food_parfait: "季節のフルーツパフェ",
            btn_blog_list: "ブログ一覧を見る", btn_top: "トップページへ戻る", popular: "Popular",
            title_rules: "お願いとマナー",
            title_contact_form: "ご予約・お問い合わせ", contact_desc: "ご来店やイベントに関するお問い合わせはこちら",
            contact_label_name: "お名前", contact_label_email: "メールアドレス", contact_label_phone: "電話番号",
            contact_label_subject: "お問い合わせ種別", contact_label_message: "メッセージ",
            contact_option_select: "選択してください", contact_option_reserve: "ご予約",
            contact_option_event: "イベントについて", contact_option_menu: "メニューについて",
            contact_option_other: "その他",
            contact_btn_send: "送信する", contact_ph_name: "山田 太郎", contact_ph_email: "example@email.com",
            contact_ph_message: "お問い合わせ内容をご記入ください",
            title_recruit_form: "メイド応募フォーム", recruit_desc: "一緒に働きたい方はこちらから応募してください♪",
            recruit_label_name: "お名前", recruit_label_age: "年齢", recruit_label_email: "メールアドレス",
            recruit_label_phone: "電話番号", recruit_label_exp: "接客経験",
            recruit_option_none: "未経験", recruit_option_cafe: "カフェ経験あり",
            recruit_option_maid: "メイドカフェ経験あり", recruit_option_other: "その他接客業経験あり",
            recruit_label_msg: "自己PR・志望動機", recruit_ph_msg: "あなたの魅力や働きたい理由を教えてください♪",
            recruit_btn_send: "応募する", recruit_ph_name: "山田 花子", recruit_ph_age: "20",
            tip_badge: "💡 TIPS",
            tip_step1: "予約優先制です。事前予約がおすすめ！", tip_step2: "お荷物はお席の下に置けます", tip_step3: "季節限定メニューは要チェック！",
            tip_step4: "恥ずかしがらずに一緒に楽しみましょう！", tip_step5: "推しメイドを見つけるのも楽しみの一つ！", tip_step6: "各種キャッシュレス決済対応しています",
            rule_1: "店内での無断撮影はご遠慮ください", rule_2: "メイドへの過度な接触はお控えください", rule_3: "他のお客様のご迷惑となる行為はご遠慮ください",
            rule_4: "メイドの個人情報に関する質問はお控えください", rule_5: "店内は全面禁煙となっております", rule_6: "みんなで楽しく、素敵な時間を過ごしましょう♪",
            guide_step1_title: "ご来店・受付", guide_step1_desc: "「おかえりなさいませ、ご主人様（お嬢様）！」の挨拶でお出迎え。<br>受付でお名前と人数をお伝えください。混雑時は少々お待ちいただく場合がございます。",
            guide_step2_title: "お席へご案内", guide_step2_desc: "メイドがお席までご案内いたします。<br>システムと料金についてご説明させていただきますので、ご不明な点はお気軽にお尋ねください。",
            guide_step3_title: "ご注文", guide_step3_desc: "メニューからお好きなドリンクやフードをお選びください。<br>メイドのおすすめメニューもございますので、迷ったらぜひお声がけを♪",
            guide_step4_title: "魔法の時間", guide_step4_desc: "ドリンクやフードが運ばれてきたら、メイドと一緒に「おいしくな〜れ♪」の魔法をかけます！<br>一緒に手を動かして、楽しい時間をお過ごしください。",
            guide_step5_title: "メイドとの交流", guide_step5_desc: "お食事を楽しみながら、メイドとおしゃべりタイム。<br>チェキ撮影やゲーム、ライブパフォーマンスなど、様々なアミューズメントもお楽しみいただけます。",
            guide_step6_title: "お会計・お見送り", guide_step6_desc: "お帰りの際はレジでお会計をお願いいたします。<br>メイド全員で「またお帰りをお待ちしております♪」とお見送りいたします。",
            footer_desc: "魔法と夢が広がる、秋葉原の王道コンセプトカフェ。可愛いメイドたちと心温まるひとときをお過ごしください。",
            footer_terms: "利用規約",
            footer_privacy: "プライバシーポリシー",
            access_address: "住所", access_address_val: "東京都千代田区外神田1-X-X 秋葉原ドリームビル3F",
            access_hours: "営業時間", access_hours_val: "平日: 15:00 - 23:00<br>土日祝: 12:00 - 23:00",
            access_phone: "電話番号",
            terms_title: "利用規約",
            terms_intro: "Magical Cafe ALICE（以下「当店」）をご利用いただく際は、本規約に同意したものとみなします。すべてのご主人様・お嬢様に魔法の時間をお楽しみいただくため、以下のルールを遵守してください。",
            terms_s1_title: "第1条（目的）",
            terms_s1_desc: "本規約は、当店のサービスを安全かつ快適にご利用いただくための基本的なルールを定めるものです。",
            terms_s2_title: "第2条（入店およびご利用）",
            terms_s2_li1: "当店はコンセプトカフェであり、メイドによる給仕を楽しむ場所です。",
            terms_s2_li2: "他のお客様の迷惑となる行為、または当店の運営を妨げる行為は禁止します。",
            terms_s3_title: "第3条（禁止事項）",
            terms_s3_desc: "お客様は、以下の行為を行ってはなりません。",
            terms_s3_li1: "キャストに対する過度な接触、公序良俗に反する言動、ハラスメント。",
            terms_s3_li2: "キャストの連絡先を聞き出す行為、またはプライベートで会おうとする行為。",
            terms_s3_li3: "許可された場所以外でのキャストおよび店内の撮影、録音。",
            terms_s3_li4: "他のお客様やキャストのプライバシーを侵害する行為。",
            terms_s3_li5: "暴力行為、泥酔状態での入店。",
            terms_s4_title: "第4条（利用の中止）",
            terms_s4_desc: "本規約に違反した場合、当店の判断により直ちにご利用を中止し、退店していただく場合があります。その際、料金の返金は行いません。また、悪質な場合は以降の出入りを禁止いたします。",
            terms_s5_title: "第5条（免責事項）",
            terms_s5_li1: "店内での紛失、盗難、お客様同士のトラブルについて、当店は一切の責任を負いかねます。",
            terms_s5_li2: "やむを得ない事情により営業内容を変更・中止する場合があります。",
            privacy_title: "プライバシーポリシー",
            privacy_intro: "Magical Cafe ALICE（以下「当店」）は、お客様の個人情報を適切に保護することが社会的責務であると考え、以下の通りプライバシーポリシーを定め、運用いたします。",
            privacy_s1_title: "1. 個人情報の取得",
            privacy_s1_desc: "当店は、お問い合わせフォーム、採用応募フォーム、ご予約等を通じて、適法かつ公正な手段によってお客様の個人情報（氏名、メールアドレス、電話番号等）を収集いたします。",
            privacy_s2_title: "2. 個人情報の利用目的",
            privacy_s2_desc: "収集した個人情報は、以下の目的のためにのみ利用いたします。",
            privacy_s2_li1: "お問い合わせへの回答および資料の送付",
            privacy_s2_li2: "採用選考および採用合否の連絡",
            privacy_s2_li3: "ご予約の確認およびサービスの提供",
            privacy_s2_li4: "当店からの重要なお知らせの送信",
            privacy_s3_title: "3. 第三者への提供",
            privacy_s3_desc: "当店は、法令に基づく場合を除き、お客様の同意を得ることなく個人情報を第三者に提供することはありません。",
            privacy_s4_title: "4. 個人情報の管理",
            privacy_s4_desc: "当店は、個人情報の漏洩、紛失、改ざん等を防ぐため、適切なセキュリティ対策を講じ、厳重に管理いたします。",
            privacy_s5_title: "5. 個人情報の照会・訂正・削除",
            privacy_s5_desc: "お客様ご本人から個人情報の照会、訂正、削除等の希望があった場合は、ご本人であることを確認した上で、速やかに対応いたします。",
            privacy_s6_title: "6. お問い合わせ窓口",
            privacy_s6_desc: "当店の個人情報の取扱いに関するお問い合わせは、お問い合わせフォームよりご連絡ください。",
            btn_top: "トップページに戻る"
        },
        en: {
            nav_concept: "Concept", nav_guide: "Guide", nav_cast: "Cast", nav_system: "System",
            nav_events: "Events", nav_blog: "Blog", nav_access: "Location", nav_contact: "Contact",
            hero_badge: "Welcome to Wonderland",
            hero_title_1: "Welcome to", hero_title_2: "the Land of", hero_title_3: "Dreams & Magic",
            hero_subtitle: "The cutest classic<br>concept cafe in Akihabara",
            btn_system: "View Price System", btn_access: "Access", btn_cast_list: "View Cast List",
            title_concept: "Concept", title_guide: "How to Enjoy", title_cast: "Cast",
            title_system: "System & Price", title_events: "Event Schedule", title_blog: "Maid Blog",
            title_access: "Access", title_contact: "Contact Us",
            cast_list_title: "Cast List", cast_list_p: "Our unique maids are looking forward to your return!",
            blog_list_title: "Maid Blog List", blog_list_p: "Maids sharing their daily life and latest news at the mansion♪",
            sub_concept: "Our Story", sub_guide: "How to Enjoy", sub_cast: "Cast Members",
            sub_system: "Price List", sub_events: "What's Coming", sub_blog: "Maid Diary",
            sub_access: "Location", sub_contact: "Get in Touch",
            guide_desc: "New to Maid Cafes? Here's how to enjoy your first visit!",
            concept_p1: "Open the door and find yourself in a magical world where you can forget the everyday. Magical Cafe ALICE is a classic concept cafe inspired by Alice's Wonderland.",
            concept_p2: "Our cute maids will prepare delicious tea and magical moments for you. We are waiting for your return, Master and Milady. Enjoy a dreamlike time to your heart's content.",
            concept_card1_title: "Magical Time", concept_card1_desc: "Open the door and find yourself in a wonderland beyond everyday life.",
            concept_card2_title: "Cosy Space", concept_card2_desc: "Enjoy our special tea and handmade sweets in a cute mansion.",
            concept_card3_title: "Classic Hospitality", concept_card3_desc: "We promise you the warmest hospitality unique to Akihabara.",
            charge_title: "Table Charge (60 min)", charge_male: "Gents", charge_female: "Ladies", charge_ext: "Extension (30 min)", charge_note: "*One drink order required per person",
            nomihodai_title: "All-You-Can-Drink (60 min)", nomihodai_soft: "Soft Drinks", nomihodai_alc: "Alcoholic", nomihodai_set: "Cheki Set", nomihodai_note: "*Great value! Includes table charge.",
            food_title: "Food", food_note: "*Many other food and dessert items available!",
            food_omurice: "Magic Omurice (with drawings)", food_pancake: "Maid's Special Fluffy Pancakes", food_parfait: "Seasonal Fruit Parfait",
            btn_blog_list: "View All Blogs", btn_top: "Back to Home", popular: "Popular",
            title_rules: "Rules & Manners",
            title_contact_form: "Inquiry Form", contact_desc: "Click here for inquiries about visits and events.",
            contact_label_name: "Name", contact_label_email: "Email", contact_label_phone: "Phone Number",
            contact_label_subject: "Inquiry Type", contact_label_message: "Message",
            contact_option_select: "Please select", contact_option_reserve: "Reservation",
            contact_option_event: "About Events", contact_option_menu: "About Menu",
            contact_option_other: "Other",
            contact_btn_send: "Send Message", contact_ph_name: "Your Name", contact_ph_email: "your@email.com",
            contact_ph_message: "Please enter your message here",
            title_recruit_form: "Application Form", recruit_desc: "Apply here if you want to work with us♪",
            recruit_label_name: "Name", recruit_label_age: "Age", recruit_label_email: "Email",
            recruit_label_phone: "Phone Number", recruit_label_exp: "Experience",
            recruit_option_none: "No experience", recruit_option_cafe: "Cafe experience",
            recruit_option_maid: "Maid cafe experience", recruit_option_other: "Other experience",
            recruit_label_msg: "Self-PR & Motivation", recruit_ph_msg: "Tell us about your charm and why you want to work here♪",
            recruit_btn_send: "Apply Now", recruit_ph_name: "Hanako Yamada", recruit_ph_age: "20",
            tip_badge: "💡 TIPS",
            tip_step1: "Priority for reservations. Booking in advance is recommended!", tip_step2: "You can place your luggage under your seat.", tip_step3: "Don't forget to check our seasonal limited menu!",
            tip_step4: "Don't be shy, let's have fun casting magic together!", tip_step5: "Finding your 'Oshi' (favorite) maid is part of the fun!", tip_step6: "Various cashless payments are accepted.",
            rule_1: "Unauthorized photography inside the cafe is prohibited.", rule_2: "Please refrain from excessive physical contact with maids.", rule_3: "Please avoid actions that disturb other guests.",
            rule_4: "Please do not ask for personal information about the maids.", rule_5: "The entire cafe is non-smoking.", rule_6: "Let's all have a wonderful and fun time together!",
            guide_step1_title: "Arrival & Reception", guide_step1_desc: "We welcome you with 'Welcome home, Master/Milady!'<br>Please tell us your name and party size at the reception.",
            guide_step2_title: "Escort to Seat", guide_step2_desc: "A maid will show you to your seat.<br>We will explain the system and pricing, so feel free to ask any questions.",
            guide_step3_title: "Ordering", guide_step3_desc: "Choose your favorite drinks and food from the menu.<br>Maids also have recommended items, so just ask if you're unsure!",
            guide_step4_title: "Magic Time", guide_step4_desc: "When items arrive, we'll cast 'Oishiku-nare♪' magic with the maid!<br>Let's move our hands together and have a blast.",
            guide_step5_title: "Interaction", guide_step5_desc: "Enjoy chatting with maids while dining.<br>You can also enjoy 'Cheki' photos, games, and live performances.",
            guide_step6_title: "Check-out & Farewell", guide_step6_desc: "Please pay at the register before you leave.<br>All maids will see you off with 'We look forward to your return!♪'",
            footer_desc: "A classic concept cafe in Akihabara where magic and dreams unfold. Enjoy a heartwarming time with our cute maids.",
            footer_terms: "Terms of Service",
            footer_privacy: "Privacy Policy",
            access_address: "Address", access_address_val: "3F Akiba Dream Bldg, 1-X-X Sotokanda, Chiyoda-ku, Tokyo",
            access_hours: "Business Hours", access_hours_val: "Weekdays: 3PM - 11PM<br>Weekends & Holidays: 12PM - 11PM",
            access_phone: "Phone Number",
            terms_title: "Terms of Service",
            terms_intro: "By using Magical Cafe ALICE (hereinafter referred to as 'the Shop'), you are deemed to have agreed to these terms. To ensure that all masters and princesses enjoy their magical time, please observe the following rules.",
            terms_s1_title: "Article 1 (Purpose)",
            terms_s1_desc: "These terms set forth the basic rules for safe and comfortable use of our services.",
            terms_s2_title: "Article 2 (Entry and Use)",
            terms_s2_li1: "This shop is a concept cafe where you can enjoy service provided by maids.",
            terms_s2_li2: "Any acts that disturb other customers or hinder the operation of the shop are prohibited.",
            terms_s3_title: "Article 3 (Prohibited Acts)",
            terms_s3_desc: "Customers must not perform the following acts.",
            terms_s3_li1: "Excessive contact, offensive speech or behavior, or harassment towards the cast.",
            terms_s3_li2: "Asking for the cast's contact information or attempting to meet them privately.",
            terms_s3_li3: "Taking photos or recording the cast or inside the shop without permission.",
            terms_s3_li4: "Acts that infringe upon the privacy of other customers or the cast.",
            terms_s3_li5: "Violent behavior or entry while heavily intoxicated.",
            terms_s4_title: "Article 4 (Suspension of Use)",
            terms_s4_desc: "If you violate these terms, we may immediately suspend your use and ask you to leave. In such cases, no refunds will be given. Furthermore, in malicious cases, future entry will be banned.",
            terms_s5_title: "Article 5 (Disclaimer)",
            terms_s5_li1: "The shop is not responsible for any loss, theft, or trouble between customers within the shop.",
            terms_s5_li2: "Business content may change or be suspended due to unavoidable circumstances.",
            privacy_title: "Privacy Policy",
            privacy_intro: "Magical Cafe ALICE (hereinafter referred to as 'the Shop') considers the appropriate protection of customers' personal information to be a social responsibility and has established the following privacy policy.",
            privacy_s1_title: "1. Collection of Personal Information",
            privacy_s1_desc: "The shop collects customers' personal information (name, email address, phone number, etc.) through inquiry forms, recruitment application forms, reservations, etc., by lawful and fair means.",
            privacy_s2_title: "2. Purpose of Use of Personal Information",
            privacy_s2_desc: "Collected personal information will be used only for the following purposes.",
            privacy_s2_li1: "Responding to inquiries and sending materials",
            privacy_s2_li2: "Recruitment selection and notification of results",
            privacy_s2_li3: "Confirmation of reservations and provision of services",
            privacy_s2_li4: "Sending important notices from the shop",
            privacy_s3_title: "3. Provision to Third Parties",
            privacy_s3_desc: "The shop will not provide personal information to third parties without the customer's consent, except as required by law.",
            privacy_s4_title: "4. Management of Personal Information",
            privacy_s4_desc: "The shop implements appropriate security measures to prevent leakage, loss, or tampering of personal information and manages it strictly.",
            privacy_s5_title: "5. Inquiry, Correction, and Deletion of Personal Information",
            privacy_s5_desc: "If a customer wishes to inquire about, correct, or delete their personal information, we will respond promptly after verifying their identity.",
            privacy_s6_title: "6. Contact for Inquiries",
            privacy_s6_desc: "For inquiries regarding the handling of personal information, please contact us through the inquiry form.",
            btn_top: "Back to Top"
        }
    };

    // --- Language Switching Logic ---
    const langSwitches = document.querySelectorAll('.lang-switch');
    let currentLang = localStorage.getItem('siteLang') || 'ja';

    function applyLanguage(lang) {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translations[lang][key].replace(/<br>/g, '\n');
                } else if (el.tagName === 'SELECT') {
                    // Options would have data-i18n if needed
                } else {
                    el.innerHTML = translations[lang][key];
                }
            }
        });
        
        // Update all language switch buttons' text/state
        langSwitches.forEach(btn => {
            const langText = btn.querySelector('.lang-text');
            if (langText) {
                langText.textContent = lang === 'ja' ? 'JP/EN' : 'EN/JP';
            }
            if (lang === 'en') {
                btn.classList.add('en-active');
            } else {
                btn.classList.remove('en-active');
            }
        });

        document.documentElement.lang = lang;
        try {
            localStorage.setItem('siteLang', lang);
        } catch (e) {
            console.error('LocalStorage error:', e);
        }
    }

    // Attach click event to all language switch buttons
    langSwitches.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            currentLang = currentLang === 'ja' ? 'en' : 'ja';
            applyLanguage(currentLang);
        });
    });

    // Initial application
    applyLanguage(currentLang);
});
