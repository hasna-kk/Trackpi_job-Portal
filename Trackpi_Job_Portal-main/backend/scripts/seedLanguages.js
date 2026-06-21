const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Language = require('../models/Language');
const connectDB = require('../config/db');

dotenv.config();

const LANGUAGES = [
    "English", "Abkhaz", "Afar", "Afrikaans", "Akan", "Albanian", "Amharic", "Arabic", "Aragonese", "Armenian", "Assamese", "Avaric", "Avestan", "Aymara", "Azerbaijani", "Bambara", "Bashkir", "Basque", "Belarusian", "Bengali", "Bihari", "Bislama", "Bosnian", "Breton", "Bulgarian", "Burmese", "Catalan", "Chamorro", "Chechen", "Chichewa", "Chinese", "Chuvash", "Cornish", "Corsican", "Cree", "Croatian", "Czech", "Danish", "Divehi", "Dutch", "Dzongkha", "Esperanto", "Estonian", "Ewe", "Faroese", "Fijian", "Finnish", "French", "Fula", "Galician", "Ganda", "Georgian", "German", "Greek", "Guarani", "Gujarati", "Haitian", "Hausa", "Hebrew", "Herero", "Hindi", "Hiri Motu", "Hungarian", "Icelandic", "Ido", "Igbo", "Indonesian", "Interlingua", "Interlingue", "Inuktitut", "Inupiaq", "Irish", "Italian", "Japanese", "Javanese", "Kalaallisut", "Kannada", "Kanuri", "Kashmiri", "Kazakh", "Khmer", "Kikuyu", "Kinyarwanda", "Kirghiz", "Komi", "Kongo", "Korean", "Kurdish", "Kwanyama", "Lao", "Latin", "Latvian", "Limburgish", "Lingala", "Lithuanian", "Luga-Katanga", "Luxembourgish", "Macedonian", "Malagasy", "Malay", "Malayalam", "Maltese", "Manx", "Maori", "Marathi", "Marshallese", "Mongolian", "Nauru", "Navajo", "Ndebele (North)", "Ndebele (South)", "Ndonga", "Nepali", "Norwegian", "Norwegian Bokmal", "Norwegian Nynorsk", "Occitan", "Ojibwa", "Oriya", "Oromo", "Ossetian", "Pali", "Pashto", "Persian", "Polish", "Portuguese", "Punjabi", "Quechua", "Romanian", "Romansh", "Russian", "Samoan", "Sango", "Sanskrit", "Sardinian", "Serbian", "Shona", "Sichuan Yi", "Sindhi", "Sinhalese", "Slovak", "Slovenian", "Somali", "Sotho (South)", "Spanish", "Sundanese", "Swahili", "Swati", "Swedish", "Tagalog", "Tahitian", "Tajik", "Tamil", "Tatar", "Telugu", "Thai", "Tibetan", "Tigrinya", "Tonga", "Tsonga", "Tswana", "Turkish", "Turkmen", "Twi", "Uighur", "Ukrainian", "Urdu", "Uzbek", "Venda", "Vietnamese", "Volapuk", "Walloon", "Welsh", "Western Frisian", "Wolof", "Xhosa", "Yiddish", "Yoruba", "Zhuang", "Zulu"
];

const seedLanguages = async () => {
    try {
        await connectDB();

        console.log('Clearing existing languages...');
        await Language.deleteMany({});

        console.log('Seeding languages...');
        const langDocs = LANGUAGES.map(name => ({ name }));
        await Language.insertMany(langDocs);

        console.log('Languages seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding languages:', error);
        process.exit(1);
    }
};

seedLanguages();
