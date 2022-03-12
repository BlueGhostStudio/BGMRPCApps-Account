var DB;

methods = ['register', 'updateAccount', 'login', 'getToken'];

function constructor() {
    JS.loadModule('jsDB');
    JS.loadModule('jsFile');
    JS.include('../common/randomStr.js');
    JS.include('../common/sqlStmFra.js');

    var file = new JsFile;
    if (!file.exists(JS.__PATH_DATA__)) {
        file.mkpath(JS.__PATH_DATA__);
        file.copy(JS.__PATH_APP__ + '/account.db', JS.__PATH_DATA__ + '/account.db');
    }

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
    console.log("----- getToken -------", caller.__ISINTERNALCALL__, caller.__GRP__, caller.__APP__, caller.__OBJECT__, caller.__OBJECTID__);
    return caller.privateData(JS, 'token');
}
