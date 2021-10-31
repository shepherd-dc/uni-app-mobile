'use strict';
const db = uniCloud.database()
const _ = db.command
const MAX_LIMIT = 100

// 云函数入口函数
/**
 * 获取微信运动数据
 * @return {array} 解密后的微信运动步数
 */
exports.main = async (event, context) => {
  const { result } = await uniCloud.callFunction({
  	name: 'decryptData',
		data: {
			js_code: event.js_code,
			encryptedData: event.encryptedData,
			iv: event.iv
		}
  })
	console.log('-----decryptData------', result)
	const openid = result.openid
	await syncGrowthValue(result.stepInfoList, openid)  //调用从微信运动获得成长值的同步方法
	const allPointRecords = await syncPoint(result.stepInfoList, openid) //同步积分
  return {
		stepInfoList: result.stepInfoList,
		allPointRecords: allPointRecords.data
	}
}

/**
 * 同步微信运动数据并更新到积分数据库
 * @param {array} weRunData 从小程序API获取到的微信运动数据
 * @return {array} 积分变动数据 {time,step,changePoints}
 */
async function syncPoint(weRunData, openid) {
  var weRunToPointData = []
  //定义同步数据结果
  for (var i in weRunData) {
    weRunToPointData.push({
      time: weRunData[i].timestamp,
      step: weRunData[i].step,
      changePoints: 0
    })
  }
  //根据微信运动数据更新积分
  // for (var i in weRunData) { // 遍历查询耗时太多，阿里云服务器10秒超时，无法返回结果
    var data = weRunData[weRunData.length - 1]
    var result = weRunToPointData[weRunToPointData.length - 1]
    //查询数据库是否已存在该条微信运动记录
    var queryResult = await db.collection('user_point')
      .where({
        timestamp: data.timestamp,
        //云函数是在服务端操作，对所有用户的数据都有操作权限
        //在云函数中查询用户数据，需要添加openid的查询条件
        _openid: openid
      })
      .get()
    if (queryResult.data.length <= 0) {
      //如果不存在记录，则向数据库插入微信运动记录
      await db.collection('user_point')
        .add({
					_openid: openid, //云函数添加数据不会自动插入openid，需要手动定义
					date: new Date(Date.now() + (8 * 60 * 60 * 1000)).getTime(),
					changePoints: data.step,
					operation: "微信运动",
					timestamp: data.timestamp,
					orderId: ''
        })
      result.changePoints = data.step
    } else {
      if (queryResult.data[0].changePoints < data.step) {
        //如果存在记录，但数据库步数少于小程序API返回步数，则向数据库更新微信运动记录
        await db.collection('user_point').doc(queryResult.data[0]._id)
          .update({
						date: new Date(Date.now() + (8 * 60 * 60 * 1000)).getTime(),
						changePoints: data.step
          })
        result.changePoints = data.step - queryResult.data[0].changePoints
      }
    }
  // }
  //更新用户的总可用积分

  //首先获取所有积分记录
  // 先取出集合记录总数
  const countResult = await db.collection('user_point').count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('user_point').where({
      _openid: openid
    }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  var allPointRecords = (await Promise.all(tasks)).reduce((acc, cur) => ({
    data: acc.data.concat(cur.data),
    errMsg: acc.errMsg,
  }))

  //计算总积分，并更新到user表
  var totalPointsNum = 0
  allPointRecords.data.forEach(function(item) {
    totalPointsNum += item.changePoints;
  });
  await db.collection('user')
    .where({
      openid
    })
    .update({
      point: totalPointsNum
    })
  
  //调用风控规则校验
  await uniCloud.callFunction({
    name: 'pointRiskControl',
    data: {
      openid
    }
  })
	
	console.log('---allPointRecords---', allPointRecords)
	
	return allPointRecords
}

/**
 * 同步微信运动数据并更新到成长值数据库
 * @param {array} weRunData 从微信运动 API 获得的用户最近 30 天的运动数据
 */
async function syncGrowthValue(weRunData, openid) {
  //-----------------算法步骤 2 对每一天的微信运动数据依次执行下列步骤----------begin
  // for (var i in weRunData) { // 遍历查询耗时太多，阿里云服务器10秒超时，无法返回结果
    var data = weRunData[weRunData.length - 1] // 取最后一条数据测试
    //查询数据库是否已存在该条微信运动记录
    var queryResult = await db.collection('user_growth_value')
      .where({
        timestamp: data.timestamp,
        //云函数是在服务端操作，对所有用户的数据都有操作权限
        //在云函数中查询用户数据，需要添加openid的查询条件
        _openid: openid
      })
      .get()
    if (queryResult.data.length <= 0) {
      //如果不存在记录，则向数据库插入微信运动记录
      await db.collection('user_growth_value')
        .add({
					_openid: openid, //云函数添加数据不会自动插入openid，需要手动定义
					date: new Date(Date.now() + (8 * 60 * 60 * 1000)).getTime(),
					changeGrowthValue: data.step,
					operation: "微信运动",
					timestamp: data.timestamp,
					orderId: '',
					noteId: ''
        })
    } else {
      if (queryResult.data[0].changeGrowthValue < data.step) {
        //如果存在记录，但数据库步数少于小程序API返回步数，则向数据库更新微信运动记录
        await db.collection('user_growth_value').doc(queryResult.data[0]._id)
          .update({
						date: new Date(Date.now() + (8 * 60 * 60 * 1000)).getTime(),
						changeGrowthValue: data.step
          })
      }
    }
  // }
  //-----------------算法步骤 2 对每一天的微信运动数据依次执行下列步骤----------end
  
  //-----------------算法步骤 3 更新用户当前总成长值-------------------------begin
  //第一步 获取所有成长值记录
  // 先取出集合记录总数
  const countResult = await db.collection('user_growth_value').count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('user_growth_value').where({
      _openid: openid
    }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  var allGrowthValueRecords = (await Promise.all(tasks)).reduce((acc, cur) => ({
    data: acc.data.concat(cur.data),
    errMsg: acc.errMsg,
  }))

  //第二步 计算总成长值，并更新到user表
  var totalGrowthValueNum = 0
  allGrowthValueRecords.data.forEach(function(item) {
    totalGrowthValueNum += item.changeGrowthValue;
  });
  await db.collection('user')
    .where({
      openid: openid
    })
    .update({
      growthValue: totalGrowthValueNum
    })
  //-----------------算法步骤 3 更新用户当前总成长值-------------------------end

  //算法步骤 4 调用风控规则校验
  await uniCloud.callFunction({
    name: 'growthValueRiskControl',
    data: {
      openid
    }
  })
}