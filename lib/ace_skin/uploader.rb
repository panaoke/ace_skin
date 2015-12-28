module AceSkin
  class Uploader < CarrierWave::Storage::Aliyun::Connection
    include Singleton

    def initialize
      @fast_upload_path   = CarrierWave::Uploader::Base.fast_upload_path || 'fast_upload'

      super({
        aliyun_access_id: CarrierWave::Uploader::Base.aliyun_access_id,
        aliyun_access_key: CarrierWave::Uploader::Base.aliyun_access_key,
        aliyun_bucket: CarrierWave::Uploader::Base.aliyun_bucket,
        aliyun_area: CarrierWave::Uploader::Base.aliyun_area || 'cn-hangzhou' ,
        aliyun_internal: CarrierWave::Uploader::Base.aliyun_internal ,
        aliyun_upload_host: CarrierWave::Uploader::Base.aliyun_upload_host,
        aliyun_host: CarrierWave::Uploader::Base.aliyun_host,
      })
    end

    def fast_upload(file, options = {})
      file = File.open(file) if file.is_a?(String)
      file_name = file.path.split('/').last
      file_format = file_name.split('.').last
      path = "#{options[:img_path] || @fast_upload_path}/#{(Time.now.to_f * 10**6).to_i}.#{file_format}"

      put(path, file, options)
    end


  end
end
