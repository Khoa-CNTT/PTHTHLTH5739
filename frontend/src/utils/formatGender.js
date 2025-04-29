export const formatGender = (gender) => {
    if (gender === 'male') {
        return 'Nam';
    } else if (gender === 'female') {
        return 'Nữ';
    }
    return gender; // Trả về giá trị ban đầu nếu không phải male hoặc female
};