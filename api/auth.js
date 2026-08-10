import { Redis } from '@upstash/redis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password, deviceId } = req.body;
  
  if (!password || !deviceId) {
    return res.status(400).json({ error: 'Missing password or deviceId' });
  }

  try {
    // 管理员密码后门（不限制设备和时间）
    if (password === 'admin888') {
      return res.status(200).json({ success: true, message: '欢迎文总！' });
    }

    const redis = Redis.fromEnv();
    
    const deviceKey = `device:${deviceId}`;
    const pwdKey = `pwd:${password}`;

    // 1. 查设备：该设备ID是否已经白嫖过？
    const deviceUsed = await redis.get(deviceKey);
    
    // 2. 查密码状态
    const pwdState = await redis.get(pwdKey);

    const now = Date.now();

    if (pwdState) {
      // 密码已被激活
      if (pwdState.deviceId !== deviceId) {
        return res.status(403).json({ error: '该访客密码已被其他设备使用！' });
      }
      
      // 检查是否过期（6天）
      if (now > pwdState.expiresAt) {
        return res.status(403).json({ error: '您的设备体验期（6天）已结束，请购买正式版。' });
      }

      // 未过期，正常进入
      return res.status(200).json({ success: true, message: '验证成功，欢迎回来！' });
      
    } else {
      // 密码未被激活（新密码）
      if (deviceUsed) {
        return res.status(403).json({ error: '该设备已使用过其他访客密码，不可重复体验。' });
      }

      // 首次激活绑定
      const expiresAt = now + 6 * 24 * 60 * 60 * 1000;
      await redis.set(pwdKey, { deviceId, activatedAt: now, expiresAt });
      await redis.set(deviceKey, password); // 标记该设备已使用

      return res.status(200).json({ 
        success: true, 
        message: '访客体验已激活（有效期6天）' 
      });
    }

  } catch (error) {
    // 降级处理：如果没有配置 Redis (UPSTASH_REDIS_REST_URL)，为了防止项目直接崩溃，返回 mock 成功，并提示配置
    if (error.message && error.message.includes('UPSTASH_REDIS_REST_URL')) {
       console.warn('Missing Redis Config, running in mock mode');
       return res.status(200).json({ 
           success: true, 
           message: '[Mock模式] 登录成功！(请在 Vercel 中配置 Upstash Redis KV 数据库实现真实校验)' 
       });
    }
    console.error('Auth API Error:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
}