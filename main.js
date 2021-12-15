var DB;

methods = ['register', 'updateAccount', 'login', 'getToken'];

function constructor() {
    JS.loadModule('jsDB');
    JS.include('../common/randomStr.js');
    JS.include('../common/sqlStmFra.js');

    DB = new JsDB;
    DB.openDB('account.db');
}

function register(caller) {
    var rs = randomStr(6);
    if (DB.exec('SELECT * FROM `account` WHERE `token`=:T', {
              ':T': rs
          }).rows.length == 0) {
        DB.exec('INSERT INTO `account` (`token`) VALUES (:T)', {':T': rs});
        // caller.setPrivateData(JS, 'token', rs);

        return rs;
    } else
        return register(caller);
}

function updateAccount(caller, token, account) {
    var stmFra = updateStatementFragments(['nick'], account);
    stmFra.bindValues[':T'] = token;
    return DB
        .exec(
            'UPDATE `account` SET ' + stmFra.stm + ' WHERE `token`=:T',
            bindValues)
        .ok;
}

function login(caller, token) {
    caller.setPrivateData(JS, 'token', undefined);
    if (DB.exec('SELECT * FROM `account` WHERE `token`=:T', {
              ':T': token
          }).rows.length > 0) {
        caller.setPrivateData(JS, 'token', token);
        return true;
    } else
        return false;

    return true;
}

function getToken(caller) {
    return caller.privateData(JS, 'token');
}
