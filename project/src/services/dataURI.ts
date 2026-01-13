import DataUriParser from 'datauri/parser.js';
const parser = new DataUriParser();

const getDataUri = (file: File): string | null => {
    const extName: string = file.name.split('.').pop() || ''; // Extract file extension manually
    return parser.format(extName, file).content || null;
};

export default getDataUri;