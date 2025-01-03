import React, { useEffect, useState } from 'react'

function languages() {
    const [languages, setlanguages] = useState([]);
    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                const response = await fetch('https://api.allorigins.win/raw?url=https://monkeytype.com/languages/_list.json');
                const data = await response.json();
                setlanguages(data);
            } catch (error) {
                console.error('Error fetching languages:', error);
            }
        };
        fetchLanguages();
        console.log(languages);
    }, []);
    return{languages};

}

export default languages