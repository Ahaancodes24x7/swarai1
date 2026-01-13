import React, { createContext, useContext, useState, useCallback } from 'react';

export type Language = 'en' | 'hi' | 'pa' | 'ta' | 'te';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

export const translations: Translations = {
  // Header & Navigation
  'nav.home': { en: 'Home', hi: 'होम', pa: 'ਘਰ', ta: 'முகப்பு', te: 'హోమ్' },
  'nav.getStarted': { en: 'Get Started', hi: 'शुरू करें', pa: 'ਸ਼ੁਰੂ ਕਰੋ', ta: 'தொடங்குங்கள்', te: 'ప్రారంభించండి' },
  'nav.learnMore': { en: 'Learn More', hi: 'और जानें', pa: 'ਹੋਰ ਜਾਣੋ', ta: 'மேலும் அறிய', te: 'మరింత తెలుసుకోండి' },
  'nav.whyItMatters': { en: 'Why It Matters', hi: 'यह क्यों महत्वपूर्ण है', pa: 'ਇਹ ਕਿਉਂ ਮਹੱਤਵਪੂਰਨ ਹੈ', ta: 'இது ஏன் முக்கியம்', te: 'ఇది ఎందుకు ముఖ్యం' },
  'nav.backToHome': { en: 'Back to Home', hi: 'होम पर वापस', pa: 'ਘਰ ਵਾਪਸ', ta: 'முகப்புக்குத் திரும்பு', te: 'హోమ్‌కు తిరిగి' },
  
  // Hero Section
  'hero.tagline': { en: 'Detect • Support • Include', hi: 'पहचानें • सहायता करें • शामिल करें', pa: 'ਪਛਾਣੋ • ਸਹਾਇਤਾ ਕਰੋ • ਸ਼ਾਮਲ ਕਰੋ', ta: 'கண்டறி • ஆதரவு • உள்ளடக்கு', te: 'గుర్తించు • మద్దతు • చేర్చు' },
  'hero.title': { en: 'Voice-First AI for Early Detection of Dyslexia & Dyscalculia', hi: 'डिस्लेक्सिया और डिस्कैलक्यूलिया की प्रारंभिक पहचान के लिए वॉयस-फर्स्ट AI', pa: 'ਡਿਸਲੈਕਸੀਆ ਅਤੇ ਡਿਸਕੈਲਕੁਲੀਆ ਦੀ ਜਲਦੀ ਪਛਾਣ ਲਈ ਵੌਇਸ-ਫਰਸਟ AI', ta: 'டிஸ்லெக்சியா & டிஸ்கால்குலியாவை முன்கூட்டியே கண்டறிய குரல் அடிப்படையிலான AI', te: 'డిస్లెక్సియా & డిస్కాల్క్యులియా త్వరగా గుర్తించడానికి వాయిస్-ఫస్ట్ AI' },
  'hero.description': { en: 'SWAR uses advanced speech recognition technology to identify learning differences early, empowering educators and parents to provide timely support.', hi: 'SWAR उन्नत भाषण पहचान तकनीक का उपयोग करके सीखने के अंतर को जल्दी पहचानता है।', pa: 'SWAR ਉੱਨਤ ਬੋਲੀ ਪਛਾਣ ਤਕਨਾਲੋਜੀ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਸਿੱਖਣ ਦੇ ਅੰਤਰਾਂ ਨੂੰ ਜਲਦੀ ਪਛਾਣਦਾ ਹੈ।', ta: 'SWAR மேம்பட்ட பேச்சு அங்கீகார தொழில்நுட்பத்தைப் பயன்படுத்தி கற்றல் வேறுபாடுகளை முன்கூட்டியே கண்டறியும்.', te: 'SWAR అధునాతన స్పీచ్ రికగ్నిషన్ టెక్నాలజీని ఉపయోగించి నేర్చుకునే తేడాలను త్వరగా గుర్తిస్తుంది.' },
  
  // Role Selection
  'role.title': { en: 'How can we help you today?', hi: 'आज हम आपकी कैसे मदद कर सकते हैं?', pa: 'ਅੱਜ ਅਸੀਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦੇ ਹਾਂ?', ta: 'இன்று நாங்கள் உங்களுக்கு எப்படி உதவ முடியும்?', te: 'ఈ రోజు మేము మీకు ఎలా సహాయం చేయగలము?' },
  'role.parent': { en: 'I am a Parent', hi: 'मैं एक अभिभावक हूं', pa: 'ਮੈਂ ਇੱਕ ਮਾਪੇ ਹਾਂ', ta: 'நான் ஒரு பெற்றோர்', te: 'నేను తల్లిదండ్రిని' },
  'role.parentDesc': { en: 'Track your child\'s progress and access learning resources', hi: 'अपने बच्चे की प्रगति ट्रैक करें', pa: 'ਆਪਣੇ ਬੱਚੇ ਦੀ ਤਰੱਕੀ ਟਰੈਕ ਕਰੋ', ta: 'உங்கள் குழந்தையின் முன்னேற்றத்தை கண்காணிக்கவும்', te: 'మీ పిల్లల పురోగతిని ట్రాక్ చేయండి' },
  'role.teacher': { en: 'I am a Teacher', hi: 'मैं एक शिक्षक हूं', pa: 'ਮੈਂ ਇੱਕ ਅਧਿਆਪਕ ਹਾਂ', ta: 'நான் ஒரு ஆசிரியர்', te: 'నేను ఉపాధ్యాయుడిని' },
  'role.teacherDesc': { en: 'Assess students and manage learning sessions', hi: 'छात्रों का मूल्यांकन करें', pa: 'ਵਿਦਿਆਰਥੀਆਂ ਦਾ ਮੁਲਾਂਕਣ ਕਰੋ', ta: 'மாணவர்களை மதிப்பிடுங்கள்', te: 'విద్యార్థులను అంచనా వేయండి' },
  
  // How SWAR Works
  'howItWorks.title': { en: 'How SWAR Works', hi: 'SWAR कैसे काम करता है', pa: 'SWAR ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ', ta: 'SWAR எப்படி வேலை செய்கிறது', te: 'SWAR ఎలా పని చేస్తుంది' },
  'howItWorks.phonological': { en: 'Phonological Processing Analysis', hi: 'ध्वन्यात्मक प्रसंस्करण विश्लेषण', pa: 'ਧੁਨੀ ਸੰਸਾਧਨ ਵਿਸ਼ਲੇਸ਼ਣ', ta: 'ஒலியியல் செயலாக்க பகுப்பாய்வு', te: 'ధ్వనిశాస్త్ర ప్రాసెసింగ్ విశ్లేషణ' },
  'howItWorks.speechError': { en: 'Speech Error Pattern Detection', hi: 'भाषण त्रुटि पैटर्न पहचान', pa: 'ਬੋਲੀ ਗਲਤੀ ਪੈਟਰਨ ਪਛਾਣ', ta: 'பேச்சு பிழை முறை கண்டறிதல்', te: 'స్పీచ్ ఎర్రర్ ప్యాటర్న్ గుర్తింపు' },
  'howItWorks.standardized': { en: 'Standardized Assessment Integration', hi: 'मानकीकृत मूल्यांकन एकीकरण', pa: 'ਮਿਆਰੀ ਮੁਲਾਂਕਣ ਏਕੀਕਰਨ', ta: 'தரநிலைப்படுத்தப்பட்ட மதிப்பீட்டு ஒருங்கிணைப்பு', te: 'ప్రామాణిక అంచనా ఏకీకరణ' },
  'howItWorks.flagging': { en: 'Intelligent Flagging System', hi: 'बुद्धिमान फ्लैगिंग सिस्टम', pa: 'ਬੁੱਧੀਮਾਨ ਫਲੈਗਿੰਗ ਸਿਸਟਮ', ta: 'புத்திசாலித்தனமான கொடியிடல் அமைப்பு', te: 'తెలివైన ఫ్లాగింగ్ సిస్టమ్' },
  
  // Auth
  'auth.login': { en: 'Login', hi: 'लॉगिन', pa: 'ਲੌਗਇਨ', ta: 'உள்நுழை', te: 'లాగిన్' },
  'auth.signup': { en: 'Sign Up', hi: 'साइन अप', pa: 'ਸਾਈਨ ਅੱਪ', ta: 'பதிவு செய்', te: 'సైన్ అప్' },
  'auth.email': { en: 'Email', hi: 'ईमेल', pa: 'ਈਮੇਲ', ta: 'மின்னஞ்சல்', te: 'ఇమెయిల్' },
  'auth.password': { en: 'Password', hi: 'पासवर्ड', pa: 'ਪਾਸਵਰਡ', ta: 'கடவுச்சொல்', te: 'పాస్వర్డ్' },
  'auth.fullName': { en: 'Full Name', hi: 'पूरा नाम', pa: 'ਪੂਰਾ ਨਾਮ', ta: 'முழு பெயர்', te: 'పూర్తి పేరు' },
  'auth.confirmPassword': { en: 'Confirm Password', hi: 'पासवर्ड की पुष्टि करें', pa: 'ਪਾਸਵਰਡ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ', ta: 'கடவுச்சொல்லை உறுதிப்படுத்து', te: 'పాస్వర్డ్ నిర్ధారించండి' },
  'auth.accessDashboard': { en: 'Access your personalized dashboard', hi: 'अपने व्यक्तिगत डैशबोर्ड तक पहुंचें', pa: 'ਆਪਣੇ ਨਿੱਜੀ ਡੈਸ਼ਬੋਰਡ ਤੱਕ ਪਹੁੰਚ ਕਰੋ', ta: 'உங்கள் தனிப்பயனாக்கப்பட்ட டாஷ்போர்டை அணுகவும்', te: 'మీ వ్యక్తిగత డాష్‌బోర్డ్‌ను యాక్సెస్ చేయండి' },
  'auth.loginFailed': { en: 'Login Failed', hi: 'लॉगिन विफल', pa: 'ਲੌਗਇਨ ਅਸਫਲ', ta: 'உள்நுழைவு தோல்வி', te: 'లాగిన్ విఫలమైంది' },
  'auth.signupFailed': { en: 'Sign Up Failed', hi: 'साइन अप विफल', pa: 'ਸਾਈਨ ਅੱਪ ਅਸਫਲ', ta: 'பதிவு தோல்வி', te: 'సైన్ అప్ విఫలమైంది' },
  'auth.accountCreated': { en: 'Account Created!', hi: 'खाता बन गया!', pa: 'ਖਾਤਾ ਬਣ ਗਿਆ!', ta: 'கணக்கு உருவாக்கப்பட்டது!', te: 'ఖాతా సృష్టించబడింది!' },
  'auth.welcomeRedirect': { en: 'Welcome to SWAR! Redirecting to your dashboard...', hi: 'SWAR में आपका स्वागत है! आपके डैशबोर्ड पर रीडायरेक्ट हो रहा है...', pa: 'SWAR ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ! ਤੁਹਾਡੇ ਡੈਸ਼ਬੋਰਡ ਤੇ ਰੀਡਾਇਰੈਕਟ ਹੋ ਰਿਹਾ ਹੈ...', ta: 'SWAR க்கு வரவேற்கிறோம்! உங்கள் டாஷ்போர்டுக்கு திருப்பிவிடப்படுகிறது...', te: 'SWAR కు స్వాగతం! మీ డాష్‌బోర్డ్‌కు రీడైరెక్ట్ అవుతోంది...' },
  'auth.switchTo': { en: 'Switch to', hi: 'स्विच करें', pa: 'ਬਦਲੋ', ta: 'மாற்று', te: 'మారు' },
  'auth.portal': { en: 'Portal', hi: 'पोर्टल', pa: 'ਪੋਰਟਲ', ta: 'போர்டல்', te: 'పోర్టల్' },
  
  // Footer
  'footer.quickLinks': { en: 'Quick Links', hi: 'त्वरित लिंक', pa: 'ਤੇਜ਼ ਲਿੰਕ', ta: 'விரைவு இணைப்புகள்', te: 'త్వరిత లింకులు' },
  'footer.resources': { en: 'Resources', hi: 'संसाधन', pa: 'ਸਰੋਤ', ta: 'வளங்கள்', te: 'వనరులు' },
  'footer.contact': { en: 'Contact Us', hi: 'संपर्क करें', pa: 'ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੋ', ta: 'தொடர்பு கொள்ளுங்கள்', te: 'మమ్మల్ని సంప్రదించండి' },
  'footer.ethics': { en: 'Ethics & Governance', hi: 'नैतिकता और शासन', pa: 'ਨੈਤਿਕਤਾ ਅਤੇ ਸ਼ਾਸਨ', ta: 'நெறிமுறைகள் & ஆளுகை', te: 'నీతిశాస్త్రం & పాలన' },
  'footer.privacy': { en: 'Privacy Policy', hi: 'गोपनीयता नीति', pa: 'ਗੋਪਨੀਯਤਾ ਨੀਤੀ', ta: 'தனியுரிமைக் கொள்கை', te: 'గోప్యతా విధానం' },
  'footer.helpCenter': { en: 'Help Center', hi: 'सहायता केंद्र', pa: 'ਮਦਦ ਕੇਂਦਰ', ta: 'உதவி மையம்', te: 'సహాయ కేంద్రం' },
  
  // Dashboard Common
  'dashboard.welcome': { en: 'Welcome', hi: 'स्वागत है', pa: 'ਜੀ ਆਇਆਂ ਨੂੰ', ta: 'வரவேற்கிறோம்', te: 'స్వాగతం' },
  'dashboard.sessions': { en: 'Sessions', hi: 'सत्र', pa: 'ਸੈਸ਼ਨ', ta: 'அமர்வுகள்', te: 'సెషన్లు' },
  'dashboard.progress': { en: 'Progress', hi: 'प्रगति', pa: 'ਤਰੱਕੀ', ta: 'முன்னேற்றம்', te: 'పురోగతి' },
  'dashboard.students': { en: 'Students', hi: 'छात्र', pa: 'ਵਿਦਿਆਰਥੀ', ta: 'மாணவர்கள்', te: 'విద్యార్థులు' },
  'dashboard.startSession': { en: 'Start Session', hi: 'सत्र शुरू करें', pa: 'ਸੈਸ਼ਨ ਸ਼ੁਰੂ ਕਰੋ', ta: 'அமர்வைத் தொடங்கு', te: 'సెషన్ ప్రారంభించండి' },
  'dashboard.reports': { en: 'Reports', hi: 'रिपोर्ट', pa: 'ਰਿਪੋਰਟਾਂ', ta: 'அறிக்கைகள்', te: 'నివేదికలు' },
  'dashboard.resources': { en: 'Learning Resources', hi: 'शिक्षण संसाधन', pa: 'ਸਿੱਖਣ ਦੇ ਸਰੋਤ', ta: 'கற்றல் வளங்கள்', te: 'నేర్చుకునే వనరులు' },
  'dashboard.logout': { en: 'Logout', hi: 'लॉगआउट', pa: 'ਲੌਗਆਉਟ', ta: 'வெளியேறு', te: 'లాగ్అవుట్' },
  
  // Teacher Dashboard
  'teacher.dashboard': { en: 'Teacher Dashboard', hi: 'शिक्षक डैशबोर्ड', pa: 'ਅਧਿਆਪਕ ਡੈਸ਼ਬੋਰਡ', ta: 'ஆசிரியர் டாஷ்போர்டு', te: 'ఉపాధ్యాయ డాష్‌బోర్డ్' },
  'teacher.manageStudents': { en: 'Manage your students', hi: 'अपने छात्रों का प्रबंधन करें', pa: 'ਆਪਣੇ ਵਿਦਿਆਰਥੀਆਂ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ', ta: 'உங்கள் மாணவர்களை நிர்வகிக்கவும்', te: 'మీ విద్యార్థులను నిర్వహించండి' },
  'teacher.addStudent': { en: 'Add New Student', hi: 'नया छात्र जोड़ें', pa: 'ਨਵਾਂ ਵਿਦਿਆਰਥੀ ਸ਼ਾਮਲ ਕਰੋ', ta: 'புதிய மாணவரைச் சேர்க்கவும்', te: 'కొత్త విద్యార్థిని జోడించండి' },
  'teacher.studentName': { en: 'Student Name', hi: 'छात्र का नाम', pa: 'ਵਿਦਿਆਰਥੀ ਦਾ ਨਾਮ', ta: 'மாணவர் பெயர்', te: 'విద్యార్థి పేరు' },
  'teacher.enterDetails': { en: 'Enter the student\'s details below', hi: 'नीचे छात्र का विवरण दर्ज करें', pa: 'ਹੇਠਾਂ ਵਿਦਿਆਰਥੀ ਦਾ ਵੇਰਵਾ ਦਰਜ ਕਰੋ', ta: 'கீழே மாணவரின் விவரங்களை உள்ளிடவும்', te: 'క్రింద విద్యార్థి వివరాలను నమోదు చేయండి' },
  'teacher.age': { en: 'Age', hi: 'आयु', pa: 'ਉਮਰ', ta: 'வயது', te: 'వయస్సు' },
  'teacher.optional': { en: 'optional', hi: 'वैकल्पिक', pa: 'ਵਿਕਲਪਿਕ', ta: 'விருப்பமானது', te: 'ఐచ్ఛికం' },
  'teacher.gradeLevel': { en: 'Grade Level', hi: 'कक्षा स्तर', pa: 'ਗ੍ਰੇਡ ਪੱਧਰ', ta: 'தர நிலை', te: 'గ్రేడ్ స్థాయి' },
  'teacher.grade': { en: 'Grade', hi: 'कक्षा', pa: 'ਗ੍ਰੇਡ', ta: 'தரம்', te: 'గ్రేడ్' },
  'teacher.selectGrade': { en: 'Select grade', hi: 'कक्षा चुनें', pa: 'ਗ੍ਰੇਡ ਚੁਣੋ', ta: 'தரத்தைத் தேர்ந்தெடுக்கவும்', te: 'గ్రేడ్ ఎంచుకోండి' },
  'teacher.recentSessions': { en: 'Recent assessment sessions', hi: 'हाल के मूल्यांकन सत्र', pa: 'ਹਾਲੀਆ ਮੁਲਾਂਕਣ ਸੈਸ਼ਨ', ta: 'சமீபத்திய மதிப்பீட்டு அமர்வுகள்', te: 'ఇటీవలి అంచనా సెషన్లు' },
  'teacher.startNewSession': { en: 'Start New Session', hi: 'नया सत्र शुरू करें', pa: 'ਨਵਾਂ ਸੈਸ਼ਨ ਸ਼ੁਰੂ ਕਰੋ', ta: 'புதிய அமர்வைத் தொடங்கவும்', te: 'కొత్త సెషన్ ప్రారంభించండి' },
  'teacher.selectStudent': { en: 'Select Student', hi: 'छात्र चुनें', pa: 'ਵਿਦਿਆਰਥੀ ਚੁਣੋ', ta: 'மாணவரைத் தேர்ந்தெடுக்கவும்', te: 'విద్యార్థిని ఎంచుకోండి' },
  'teacher.chooseStudent': { en: 'Choose a student', hi: 'एक छात्र चुनें', pa: 'ਇੱਕ ਵਿਦਿਆਰਥੀ ਚੁਣੋ', ta: 'ஒரு மாணவரைத் தேர்ந்தெடுக்கவும்', te: 'ఒక విద్యార్థిని ఎంచుకోండి' },
  'teacher.assessmentType': { en: 'Assessment Type', hi: 'मूल्यांकन प्रकार', pa: 'ਮੁਲਾਂਕਣ ਕਿਸਮ', ta: 'மதிப்பீட்டு வகை', te: 'అంచనా రకం' },
  'teacher.dyslexiaAssessment': { en: 'Dyslexia Assessment', hi: 'डिस्लेक्सिया मूल्यांकन', pa: 'ਡਿਸਲੈਕਸੀਆ ਮੁਲਾਂਕਣ', ta: 'டிஸ்லெக்சியா மதிப்பீடு', te: 'డిస్లెక్సియా అంచనా' },
  'teacher.dyscalculiaAssessment': { en: 'Dyscalculia Assessment', hi: 'डिस्कैलक्यूलिया मूल्यांकन', pa: 'ਡਿਸਕੈਲਕੁਲੀਆ ਮੁਲਾਂਕਣ', ta: 'டிஸ்கால்குலியா மதிப்பீடு', te: 'డిస్కాల్క్యులియా అంచనా' },
  'teacher.flagged': { en: 'Flagged', hi: 'चिह्नित', pa: 'ਫਲੈਗ ਕੀਤਾ', ta: 'கொடியிடப்பட்டது', te: 'ఫ్లాగ్ చేయబడింది' },
  'teacher.avgScore': { en: 'Avg Score', hi: 'औसत स्कोर', pa: 'ਔਸਤ ਸਕੋਰ', ta: 'சராசரி மதிப்பெண்', te: 'సగటు స్కోర్' },
  'teacher.noStudents': { en: 'No students yet. Add your first student!', hi: 'अभी तक कोई छात्र नहीं। अपना पहला छात्र जोड़ें!', pa: 'ਅਜੇ ਕੋਈ ਵਿਦਿਆਰਥੀ ਨਹੀਂ। ਆਪਣਾ ਪਹਿਲਾ ਵਿਦਿਆਰਥੀ ਜੋੜੋ!', ta: 'இன்னும் மாணவர்கள் இல்லை. உங்கள் முதல் மாணவரைச் சேர்க்கவும்!', te: 'ఇంకా విద్యార్థులు లేరు. మీ మొదటి విద్యార్థిని జోడించండి!' },
  'teacher.adding': { en: 'Adding...', hi: 'जोड़ रहा है...', pa: 'ਜੋੜ ਰਿਹਾ ਹੈ...', ta: 'சேர்க்கிறது...', te: 'జోడిస్తోంది...' },
  'teacher.studentAdded': { en: 'Student added successfully!', hi: 'छात्र सफलतापूर्वक जोड़ा गया!', pa: 'ਵਿਦਿਆਰਥੀ ਸਫਲਤਾਪੂਰਵਕ ਜੋੜਿਆ ਗਿਆ!', ta: 'மாணவர் வெற்றிகரமாக சேர்க்கப்பட்டார்!', te: 'విద్యార్థి విజయవంతంగా జోడించబడ్డారు!' },
  
  // Teacher Training Module
  'training.title': { en: 'Teacher Training', hi: 'शिक्षक प्रशिक्षण', pa: 'ਅਧਿਆਪਕ ਸਿਖਲਾਈ', ta: 'ஆசிரியர் பயிற்சி', te: 'ఉపాధ్యాయ శిక్షణ' },
  'training.description': { en: 'Learn how to use SWAR and support students with learning differences', hi: 'SWAR का उपयोग करना और सीखने में अंतर वाले छात्रों की सहायता करना सीखें', pa: 'SWAR ਦੀ ਵਰਤੋਂ ਕਰਨਾ ਅਤੇ ਸਿੱਖਣ ਦੇ ਅੰਤਰ ਵਾਲੇ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਸਹਾਇਤਾ ਕਰਨਾ ਸਿੱਖੋ', ta: 'SWAR பயன்படுத்துவது மற்றும் கற்றல் வேறுபாடுகள் உள்ள மாணவர்களை ஆதரிப்பது எப்படி என்று அறியவும்', te: 'SWAR ఉపయోగించడం మరియు నేర్చుకునే తేడాలు ఉన్న విద్యార్థులకు మద్దతు ఇవ్వడం నేర్చుకోండి' },
  'training.howToUse': { en: 'How to Use SWAR', hi: 'SWAR का उपयोग कैसे करें', pa: 'SWAR ਦੀ ਵਰਤੋਂ ਕਿਵੇਂ ਕਰੀਏ', ta: 'SWAR எப்படி பயன்படுத்துவது', te: 'SWAR ఎలా ఉపయోగించాలి' },
  'training.howToUseDesc': { en: 'Step-by-step guide to conduct assessments', hi: 'मूल्यांकन करने के लिए चरण-दर-चरण मार्गदर्शिका', pa: 'ਮੁਲਾਂਕਣ ਕਰਨ ਲਈ ਕਦਮ-ਦਰ-ਕਦਮ ਗਾਈਡ', ta: 'மதிப்பீடுகளை நடத்துவதற்கான படிப்படியான வழிகாட்டி', te: 'అంచనాలు నిర్వహించడానికి దశల వారీ గైడ్' },
  'training.whatIsDyslexia': { en: 'Understanding Dyslexia', hi: 'डिस्लेक्सिया को समझना', pa: 'ਡਿਸਲੈਕਸੀਆ ਨੂੰ ਸਮਝਣਾ', ta: 'டிஸ்லெக்சியாவைப் புரிந்துகொள்வது', te: 'డిస్లెక్సియాను అర్థం చేసుకోవడం' },
  'training.whatIsDyslexiaDesc': { en: 'Learn about causes, signs, and characteristics', hi: 'कारणों, संकेतों और विशेषताओं के बारे में जानें', pa: 'ਕਾਰਨਾਂ, ਸੰਕੇਤਾਂ ਅਤੇ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਬਾਰੇ ਜਾਣੋ', ta: 'காரணங்கள், அறிகுறிகள் மற்றும் பண்புகளைப் பற்றி அறியவும்', te: 'కారణాలు, సంకేతాలు మరియు లక్షణాల గురించి తెలుసుకోండి' },
  'training.whatIsDyscalculia': { en: 'Understanding Dyscalculia', hi: 'डिस्कैलक्यूलिया को समझना', pa: 'ਡਿਸਕੈਲਕੁਲੀਆ ਨੂੰ ਸਮਝਣਾ', ta: 'டிஸ்கால்குலியாவைப் புரிந்துகொள்வது', te: 'డిస్కాల్క్యులియాను అర్థం చేసుకోవడం' },
  'training.whatIsDyscalculiaDesc': { en: 'Learn about mathematical learning difficulties', hi: 'गणितीय सीखने की कठिनाइयों के बारे में जानें', pa: 'ਗਣਿਤਿਕ ਸਿੱਖਣ ਦੀਆਂ ਮੁਸ਼ਕਲਾਂ ਬਾਰੇ ਜਾਣੋ', ta: 'கணித கற்றல் சிரமங்களைப் பற்றி அறியவும்', te: 'గణిత నేర్చుకునే ఇబ్బందుల గురించి తెలుసుకోండి' },
  'training.supportStrategies': { en: 'Support Strategies', hi: 'सहायता रणनीतियां', pa: 'ਸਹਾਇਤਾ ਰਣਨੀਤੀਆਂ', ta: 'ஆதரவு உத்திகள்', te: 'మద్దతు వ్యూహాలు' },
  'training.supportStrategiesDesc': { en: 'How to help flagged students in the classroom', hi: 'कक्षा में चिह्नित छात्रों की मदद कैसे करें', pa: 'ਕਲਾਸਰੂਮ ਵਿੱਚ ਫਲੈਗ ਕੀਤੇ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਮਦਦ ਕਿਵੇਂ ਕਰੀਏ', ta: 'வகுப்பறையில் கொடியிடப்பட்ட மாணவர்களுக்கு எப்படி உதவுவது', te: 'తరగతి గదిలో ఫ్లాగ్ చేయబడిన విద్యార్థులకు ఎలా సహాయం చేయాలి' },
  
  // Parent Dashboard
  'parent.dashboard': { en: 'Parent Dashboard', hi: 'अभिभावक डैशबोर्ड', pa: 'ਮਾਪੇ ਡੈਸ਼ਬੋਰਡ', ta: 'பெற்றோர் டாஷ்போர்டு', te: 'తల్లిదండ్రుల డాష్‌బోర్డ్' },
  'parent.childProgress': { en: 'Your child\'s assessment progress', hi: 'आपके बच्चे की मूल्यांकन प्रगति', pa: 'ਤੁਹਾਡੇ ਬੱਚੇ ਦੀ ਮੁਲਾਂਕਣ ਤਰੱਕੀ', ta: 'உங்கள் குழந்தையின் மதிப்பீட்டு முன்னேற்றம்', te: 'మీ పిల్లల అంచనా పురోగతి' },
  'parent.lastSession': { en: 'Last session', hi: 'अंतिम सत्र', pa: 'ਆਖਰੀ ਸੈਸ਼ਨ', ta: 'கடைசி அமர்வு', te: 'చివరి సెషన్' },
  'parent.totalSessions': { en: 'total sessions', hi: 'कुल सत्र', pa: 'ਕੁੱਲ ਸੈਸ਼ਨ', ta: 'மொத்த அமர்வுகள்', te: 'మొత్తం సెషన్లు' },
  'parent.phonologicalImproves': { en: 'Phonological processing shows improvement', hi: 'ध्वन्यात्मक प्रसंस्करण में सुधार दिखता है', pa: 'ਧੁਨੀ ਸੰਸਾਧਨ ਵਿੱਚ ਸੁਧਾਰ ਦਿਖਾਉਂਦਾ ਹੈ', ta: 'ஒலியியல் செயலாக்கம் முன்னேற்றம் காட்டுகிறது', te: 'ధ్వనిశాస్త్ర ప్రాసెసింగ్ మెరుగుదల చూపిస్తుంది' },
  'parent.numberSense': { en: 'Number sense development is on track', hi: 'संख्या बोध विकास सही दिशा में है', pa: 'ਸੰਖਿਆ ਸਮਝ ਵਿਕਾਸ ਸਹੀ ਰਾਹ \'ਤੇ ਹੈ', ta: 'எண் உணர்வு வளர்ச்சி சரியான பாதையில் உள்ளது', te: 'సంఖ్య భావన అభివృద్ధి సరైన దారిలో ఉంది' },
  'parent.helpChild': { en: 'Help your child succeed', hi: 'अपने बच्चे को सफल होने में मदद करें', pa: 'ਆਪਣੇ ਬੱਚੇ ਨੂੰ ਸਫਲ ਹੋਣ ਵਿੱਚ ਮਦਦ ਕਰੋ', ta: 'உங்கள் குழந்தை வெற்றி பெற உதவுங்கள்', te: 'మీ పిల్లలు విజయం సాధించడంలో సహాయం చేయండి' },
  
  // Session Page
  'session.assessment': { en: 'Assessment', hi: 'मूल्यांकन', pa: 'ਮੁਲਾਂਕਣ', ta: 'மதிப்பீடு', te: 'అంచనా' },
  'session.question': { en: 'Question', hi: 'प्रश्न', pa: 'ਸਵਾਲ', ta: 'கேள்வி', te: 'ప్రశ్న' },
  'session.exercise': { en: 'exercise', hi: 'अभ्यास', pa: 'ਅਭਿਆਸ', ta: 'பயிற்சி', te: 'వ్యాయామం' },
  'session.recording': { en: 'Recording... Click to stop', hi: 'रिकॉर्डिंग... रोकने के लिए क्लिक करें', pa: 'ਰਿਕਾਰਡਿੰਗ... ਰੋਕਣ ਲਈ ਕਲਿੱਕ ਕਰੋ', ta: 'பதிவு செய்கிறது... நிறுத்த கிளிக் செய்யவும்', te: 'రికార్డింగ్... ఆపడానికి క్లిక్ చేయండి' },
  'session.clickToStart': { en: 'Click to start recording', hi: 'रिकॉर्डिंग शुरू करने के लिए क्लिक करें', pa: 'ਰਿਕਾਰਡਿੰਗ ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਕਲਿੱਕ ਕਰੋ', ta: 'பதிவைத் தொடங்க கிளிக் செய்யவும்', te: 'రికార్డింగ్ ప్రారంభించడానికి క్లిక్ చేయండి' },
  'session.recordedResponse': { en: 'Recorded Response', hi: 'रिकॉर्ड किया गया जवाब', pa: 'ਰਿਕਾਰਡ ਕੀਤਾ ਜਵਾਬ', ta: 'பதிவு செய்யப்பட்ட பதில்', te: 'రికార్డ్ చేసిన ప్రతిస్పందన' },
  'session.previous': { en: 'Previous', hi: 'पिछला', pa: 'ਪਿਛਲਾ', ta: 'முந்தைய', te: 'మునుపటి' },
  'session.next': { en: 'Next', hi: 'अगला', pa: 'ਅਗਲਾ', ta: 'அடுத்து', te: 'తదుపరి' },
  'session.finish': { en: 'Finish', hi: 'समाप्त', pa: 'ਮੁਕੰਮਲ', ta: 'முடிக்கவும்', te: 'ముగించు' },
  'session.exit': { en: 'Exit', hi: 'बाहर निकलें', pa: 'ਬਾਹਰ ਜਾਓ', ta: 'வெளியேறு', te: 'నిష్క్రమించు' },
  'session.complete': { en: 'Session Complete', hi: 'सत्र पूर्ण', pa: 'ਸੈਸ਼ਨ ਮੁਕੰਮਲ', ta: 'அமர்வு முடிந்தது', te: 'సెషన్ పూర్తయింది' },
  'session.correct': { en: 'correct', hi: 'सही', pa: 'ਸਹੀ', ta: 'சரி', te: 'సరైన' },
  'session.of': { en: 'of', hi: 'में से', pa: 'ਵਿੱਚੋਂ', ta: 'இல்', te: 'లో' },
  'session.aiAnalyzing': { en: 'AI analyzing speech patterns...', hi: 'AI भाषण पैटर्न का विश्लेषण कर रहा है...', pa: 'AI ਬੋਲੀ ਪੈਟਰਨਾਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਿਹਾ ਹੈ...', ta: 'AI பேச்சு முறைகளை பகுப்பாய்வு செய்கிறது...', te: 'AI స్పీచ్ ప్యాటర్న్‌లను విశ్లేషిస్తోంది...' },
  'session.aiAnalysis': { en: 'AI Analysis', hi: 'AI विश्लेषण', pa: 'AI ਵਿਸ਼ਲੇਸ਼ਣ', ta: 'AI பகுப்பாய்வு', te: 'AI విశ్లేషణ' },
  'session.phonemeError': { en: 'Phoneme Error Rate', hi: 'स्वनिम त्रुटि दर', pa: 'ਧੁਨੀ ਗਲਤੀ ਦਰ', ta: 'ஒலிப்பிழை விகிதம்', te: 'ఫోనెమ్ ఎర్రర్ రేట్' },
  'session.flaggedEvaluation': { en: 'Flagged for further evaluation', hi: 'आगे के मूल्यांकन के लिए चिह्नित', pa: 'ਅਗਲੇ ਮੁਲਾਂਕਣ ਲਈ ਫਲੈਗ ਕੀਤਾ', ta: 'மேலும் மதிப்பீட்டிற்காக கொடியிடப்பட்டது', te: 'తదుపరి మూల్యాంకనం కోసం ఫ్లాగ్ చేయబడింది' },
  'session.exportPDF': { en: 'Export PDF', hi: 'PDF निर्यात करें', pa: 'PDF ਐਕਸਪੋਰਟ ਕਰੋ', ta: 'PDF ஏற்றுமதி', te: 'PDF ఎగుమతి' },
  'session.retry': { en: 'Retry', hi: 'पुनः प्रयास', pa: 'ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼', ta: 'மீண்டும் முயற்சிக்கவும்', te: 'మళ్ళీ ప్రయత్నించు' },
  'session.noResponse': { en: 'No Response Recorded', hi: 'कोई जवाब रिकॉर्ड नहीं', pa: 'ਕੋਈ ਜਵਾਬ ਰਿਕਾਰਡ ਨਹੀਂ', ta: 'பதிவு செய்யப்பட்ட பதில் இல்லை', te: 'ప్రతిస్పందన రికార్డ్ చేయబడలేదు' },
  'session.speechNotAvailable': { en: 'Speech Recognition Not Available', hi: 'भाषण पहचान उपलब्ध नहीं है', pa: 'ਬੋਲੀ ਪਛਾਣ ਉਪਲਬਧ ਨਹੀਂ', ta: 'பேச்சு அங்கீகாரம் கிடைக்கவில்லை', te: 'స్పీచ్ రికగ్నిషన్ అందుబాటులో లేదు' },
  'session.pdfGenerated': { en: 'PDF Report Generated', hi: 'PDF रिपोर्ट तैयार', pa: 'PDF ਰਿਪੋਰਟ ਤਿਆਰ', ta: 'PDF அறிக்கை உருவாக்கப்பட்டது', te: 'PDF నివేదిక రూపొందించబడింది' },
  
  // Score Interpretations (Simpler terms)
  'score.excellent': { en: 'Excellent performance! No concerns detected.', hi: 'उत्कृष्ट प्रदर्शन! कोई चिंता नहीं।', pa: 'ਸ਼ਾਨਦਾਰ ਪ੍ਰਦਰਸ਼ਨ! ਕੋਈ ਚਿੰਤਾ ਨਹੀਂ।', ta: 'சிறந்த செயல்திறன்! கவலைகள் இல்லை.', te: 'అద్భుతమైన పనితీరు! ఆందోళనలు గుర్తించబడలేదు.' },
  'score.good': { en: 'Good performance. Keep practicing!', hi: 'अच्छा प्रदर्शन। अभ्यास जारी रखें!', pa: 'ਵਧੀਆ ਪ੍ਰਦਰਸ਼ਨ। ਅਭਿਆਸ ਜਾਰੀ ਰੱਖੋ!', ta: 'நல்ல செயல்திறன். பயிற்சி தொடருங்கள்!', te: 'మంచి పనితీరు. అభ్యాసం కొనసాగించండి!' },
  'score.moderate': { en: 'Some difficulties noticed. Extra support recommended.', hi: 'कुछ कठिनाइयां दिखीं। अतिरिक्त सहायता की सिफारिश।', pa: 'ਕੁਝ ਮੁਸ਼ਕਲਾਂ ਦੇਖੀਆਂ। ਵਾਧੂ ਸਹਾਇਤਾ ਦੀ ਸਿਫਾਰਸ਼।', ta: 'சில சிரமங்கள் கவனிக்கப்பட்டன. கூடுதல் ஆதரவு பரிந்துரைக்கப்படுகிறது.', te: 'కొన్ని ఇబ్బందులు గమనించబడ్డాయి. అదనపు మద్దతు సిఫార్సు.' },
  'score.concernDyslexia': { en: 'The student may have reading difficulties (possible dyslexia). Professional evaluation recommended.', hi: 'छात्र को पढ़ने में कठिनाई हो सकती है (संभावित डिस्लेक्सिया)। विशेषज्ञ मूल्यांकन की सिफारिश।', pa: 'ਵਿਦਿਆਰਥੀ ਨੂੰ ਪੜ੍ਹਨ ਵਿੱਚ ਮੁਸ਼ਕਲ ਹੋ ਸਕਦੀ ਹੈ (ਸੰਭਾਵਿਤ ਡਿਸਲੈਕਸੀਆ)। ਮਾਹਿਰ ਮੁਲਾਂਕਣ ਦੀ ਸਿਫਾਰਸ਼।', ta: 'மாணவருக்கு வாசிப்பு சிரமங்கள் இருக்கலாம் (டிஸ்லெக்சியா சாத்தியம்). நிபுணர் மதிப்பீடு பரிந்துரைக்கப்படுகிறது.', te: 'విద్యార్థికి చదవడంలో ఇబ్బందులు ఉండవచ్చు (డిస్లెక్సియా సాధ్యం). నిపుణుల మూల్యాంకనం సిఫార్సు.' },
  'score.concernDyscalculia': { en: 'The student may have math difficulties (possible dyscalculia). Professional evaluation recommended.', hi: 'छात्र को गणित में कठिनाई हो सकती है (संभावित डिस्कैलक्यूलिया)। विशेषज्ञ मूल्यांकन की सिफारिश।', pa: 'ਵਿਦਿਆਰਥੀ ਨੂੰ ਗਣਿਤ ਵਿੱਚ ਮੁਸ਼ਕਲ ਹੋ ਸਕਦੀ ਹੈ (ਸੰਭਾਵਿਤ ਡਿਸਕੈਲਕੁਲੀਆ)। ਮਾਹਿਰ ਮੁਲਾਂਕਣ ਦੀ ਸਿਫਾਰਸ਼।', ta: 'மாணவருக்கு கணித சிரமங்கள் இருக்கலாம் (டிஸ்கால்குலியா சாத்தியம்). நிபுணர் மதிப்பீடு பரிந்துரைக்கப்படுகிறது.', te: 'విద్యార్థికి గణితంలో ఇబ్బందులు ఉండవచ్చు (డిస్కాల్క్యులియా సాధ్యం). నిపుణుల మూల్యాంకనం సిఫార్సు.' },
  
  // Why It Matters Page
  'whyItMatters.title': { en: 'Why It Matters', hi: 'यह क्यों महत्वपूर्ण है', pa: 'ਇਹ ਕਿਉਂ ਮਹੱਤਵਪੂਰਨ ਹੈ', ta: 'இது ஏன் முக்கியம்', te: 'ఇది ఎందుకు ముఖ్యం' },
  'whyItMatters.subtitle': { en: 'The Impact of Learning Disabilities in India', hi: 'भारत में सीखने की अक्षमता का प्रभाव', pa: 'ਭਾਰਤ ਵਿੱਚ ਸਿੱਖਣ ਦੀਆਂ ਅਯੋਗਤਾਵਾਂ ਦਾ ਪ੍ਰਭਾਵ', ta: 'இந்தியாவில் கற்றல் குறைபாடுகளின் தாக்கம்', te: 'భారతదేశంలో నేర్చుకునే వైకల్యాల ప్రభావం' },
  'whyItMatters.prevalence': { en: 'Prevalence in India', hi: 'भारत में व्यापकता', pa: 'ਭਾਰਤ ਵਿੱਚ ਪ੍ਰਚਲਨ', ta: 'இந்தியாவில் பரவல்', te: 'భారతదేశంలో వ్యాప్తి' },
  'whyItMatters.prevalenceText': { en: '10-15% of school children in India have learning disabilities. That\'s over 35 million children who need support.', hi: 'भारत में 10-15% स्कूली बच्चों में सीखने की अक्षमता है। यह 3.5 करोड़ से अधिक बच्चे हैं जिन्हें सहायता की जरूरत है।', pa: 'ਭਾਰਤ ਵਿੱਚ 10-15% ਸਕੂਲੀ ਬੱਚਿਆਂ ਵਿੱਚ ਸਿੱਖਣ ਦੀਆਂ ਅਯੋਗਤਾਵਾਂ ਹਨ। ਇਹ 3.5 ਕਰੋੜ ਤੋਂ ਵੱਧ ਬੱਚੇ ਹਨ ਜਿਨ੍ਹਾਂ ਨੂੰ ਸਹਾਇਤਾ ਦੀ ਲੋੜ ਹੈ।', ta: 'இந்தியாவில் 10-15% பள்ளி குழந்தைகளுக்கு கற்றல் குறைபாடுகள் உள்ளன. இது 3.5 கோடிக்கும் அதிகமான குழந்தைகளுக்கு ஆதரவு தேவை.', te: 'భారతదేశంలో 10-15% పాఠశాల పిల్లలకు నేర్చుకునే వైకల్యాలు ఉన్నాయి. ఇది 3.5 కోట్లకు పైగా పిల్లలకు మద్దతు అవసరం.' },
  'whyItMatters.detection': { en: 'Early Detection Gap', hi: 'प्रारंभिक पहचान की कमी', pa: 'ਜਲਦੀ ਪਛਾਣ ਦੀ ਕਮੀ', ta: 'முன்கூட்டிய கண்டறிதல் இடைவெளி', te: 'ముందస్తు గుర్తింపు అంతరం' },
  'whyItMatters.detectionText': { en: 'Less than 10% of children with learning disabilities are identified in India. Most go undiagnosed throughout their school years.', hi: 'भारत में सीखने की अक्षमता वाले 10% से कम बच्चों की पहचान होती है। अधिकांश स्कूल के वर्षों में बिना निदान के रहते हैं।', pa: 'ਭਾਰਤ ਵਿੱਚ ਸਿੱਖਣ ਦੀਆਂ ਅਯੋਗਤਾਵਾਂ ਵਾਲੇ 10% ਤੋਂ ਘੱਟ ਬੱਚਿਆਂ ਦੀ ਪਛਾਣ ਹੁੰਦੀ ਹੈ। ਜ਼ਿਆਦਾਤਰ ਸਕੂਲ ਦੇ ਸਾਲਾਂ ਵਿੱਚ ਬਿਨਾਂ ਨਿਦਾਨ ਦੇ ਰਹਿੰਦੇ ਹਨ।', ta: 'இந்தியாவில் கற்றல் குறைபாடுகள் உள்ள 10% க்கும் குறைவான குழந்தைகள் கண்டறியப்படுகிறார்கள். பெரும்பாலானோர் பள்ளி ஆண்டுகள் முழுவதும் கண்டறியப்படாமல் உள்ளனர்.', te: 'భారతదేశంలో నేర్చుకునే వైకల్యాలు ఉన్న 10% కంటే తక్కువ పిల్లలు గుర్తించబడతారు. చాలామంది పాఠశాల సంవత్సరాలలో నిర్ధారణ లేకుండా ఉంటారు.' },
  'whyItMatters.impact': { en: 'Impact on Children', hi: 'बच्चों पर प्रभाव', pa: 'ਬੱਚਿਆਂ \'ਤੇ ਪ੍ਰਭਾਵ', ta: 'குழந்தைகளின் மீது தாக்கம்', te: 'పిల్లలపై ప్రభావం' },
  'whyItMatters.impactText': { en: 'Unidentified learning disabilities lead to low self-esteem, school dropout, and limited career opportunities. Early intervention can change lives.', hi: 'पहचानी न गई सीखने की अक्षमता से आत्मसम्मान में कमी, स्कूल छोड़ना और करियर के सीमित अवसर होते हैं। प्रारंभिक हस्तक्षेप जीवन बदल सकता है।', pa: 'ਪਛਾਣੀਆਂ ਨਾ ਗਈਆਂ ਸਿੱਖਣ ਦੀਆਂ ਅਯੋਗਤਾਵਾਂ ਘੱਟ ਸਵੈ-ਮਾਣ, ਸਕੂਲ ਛੱਡਣ ਅਤੇ ਸੀਮਤ ਕਰੀਅਰ ਮੌਕਿਆਂ ਦਾ ਕਾਰਨ ਬਣਦੀਆਂ ਹਨ। ਜਲਦੀ ਦਖਲ ਜ਼ਿੰਦਗੀ ਬਦਲ ਸਕਦਾ ਹੈ।', ta: 'கண்டறியப்படாத கற்றல் குறைபாடுகள் குறைந்த சுயமரியாதை, பள்ளி இடைநிறுத்தம் மற்றும் குறைந்த தொழில் வாய்ப்புகளுக்கு வழிவகுக்கும். முன்கூட்டிய தலையீடு வாழ்க்கையை மாற்றும்.', te: 'గుర్తించబడని నేర్చుకునే వైకల్యాలు తక్కువ ఆత్మగౌరవం, పాఠశాల మానేయడం మరియు పరిమిత వృత్తి అవకాశాలకు దారితీస్తాయి. ముందస్తు జోక్యం జీవితాలను మార్చగలదు.' },
  'whyItMatters.solution': { en: 'How SWAR Helps', hi: 'SWAR कैसे मदद करता है', pa: 'SWAR ਕਿਵੇਂ ਮਦਦ ਕਰਦਾ ਹੈ', ta: 'SWAR எப்படி உதவுகிறது', te: 'SWAR ఎలా సహాయం చేస్తుంది' },
  'whyItMatters.solutionText': { en: 'SWAR provides affordable, accessible screening in multiple Indian languages, helping identify children who need support early.', hi: 'SWAR कई भारतीय भाषाओं में किफायती, सुलभ स्क्रीनिंग प्रदान करता है, जिन बच्चों को जल्दी सहायता की जरूरत है उन्हें पहचानने में मदद करता है।', pa: 'SWAR ਕਈ ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਕਿਫਾਇਤੀ, ਪਹੁੰਚਯੋਗ ਸਕ੍ਰੀਨਿੰਗ ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ, ਜਿਨ੍ਹਾਂ ਬੱਚਿਆਂ ਨੂੰ ਜਲਦੀ ਸਹਾਇਤਾ ਦੀ ਲੋੜ ਹੈ ਉਨ੍ਹਾਂ ਦੀ ਪਛਾਣ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।', ta: 'SWAR பல இந்திய மொழிகளில் மலிவான, அணுகக்கூடிய ஸ்கிரீனிங்கை வழங்குகிறது, முன்கூட்டியே ஆதரவு தேவைப்படும் குழந்தைகளை கண்டறிய உதவுகிறது.', te: 'SWAR అనేక భారతీయ భాషలలో అందుబాటులో, చౌకైన స్క్రీనింగ్ అందిస్తుంది, ముందుగా మద్దతు అవసరమైన పిల్లలను గుర్తించడంలో సహాయపడుతుంది.' },
  'whyItMatters.statChildren': { en: 'Children Affected', hi: 'प्रभावित बच्चे', pa: 'ਪ੍ਰਭਾਵਿਤ ਬੱਚੇ', ta: 'பாதிக்கப்பட்ட குழந்தைகள்', te: 'ప్రభావితమైన పిల్లలు' },
  'whyItMatters.statUndiagnosed': { en: 'Undiagnosed', hi: 'अनिर्धारित', pa: 'ਅਣਪਛਾਤੇ', ta: 'கண்டறியப்படாதவை', te: 'నిర్ధారించబడనివి' },
  'whyItMatters.statDropout': { en: 'Higher Dropout Risk', hi: 'उच्च स्कूल छोड़ने का जोखिम', pa: 'ਉੱਚ ਸਕੂਲ ਛੱਡਣ ਦਾ ਜੋਖਮ', ta: 'அதிக இடைநிறுத்த ஆபத்து', te: 'అధిక డ్రాపౌట్ ప్రమాదం' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = useCallback((key: string): string => {
    return translations[key]?.[language] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
