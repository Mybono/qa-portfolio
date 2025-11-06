db = db.getSiblingDB('qa_portfolio');
db.createCollection('users');

db.users.insertMany([
    {
        username: 'standard_user_01',
        role: 'standard_user',
        firstName: 'standard_user_fn',
        lastName:  'standard_user_ln',
        postalCode: 123456,
        isDeleted: false,
        isVisible: false
    },
    {
        username: 'locked_out_user_01',
        role: 'locked_out_user',
        firstName: 'locked_out_user_fn',
        lastName:  'locked_out_user_ln',
        postalCode: 123456,
        isDeleted: false,
        isVisible: false
    },
    {
        username: 'problem_user_01',
        role: 'problem_user',
        firstName: 'problem_user_fn',
        lastName:  'problem_user_ln',
        postalCode: 123456,
        isDeleted: false,
        isVisible: false
    },
]);
