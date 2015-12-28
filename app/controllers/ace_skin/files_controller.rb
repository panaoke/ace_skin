module AceSkin
  class FilesController < ::ApplicationController

      def create
          # render json: {}
        options = params[:options] || {}
        urls = params[:ace_file].map do |file|
          begin
            file_options = {content_type: file.content_type}.update(options).symbolize_keys
            AceSkin::Uploader.instance.fast_upload(file.tempfile.path, file_options)
          rescue => e
            next
          end
        end
        render json: {urls: urls}
      end

  end
end
