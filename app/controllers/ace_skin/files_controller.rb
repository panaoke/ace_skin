module AceSkin
  class FilesController < ::ApplicationController

      def create
          # render json: {}
        urls = params[:ace_file].map do |file|
          begin
            AceSkin::Uploader.instance.fast_upload(file.tempfile.path, {content_type: file.content_type})
          rescue => e
            next
          end
        end
        render json: {urls: urls}
      end

  end
end
