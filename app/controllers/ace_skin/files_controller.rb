module AceSkin
  class FilesController < ::ApplicationController

      def create
          # render json: {}
        urls = params[:ace_file].map do |file|
          begin
            AceSkin::Uploader.instance.fast_upload(file.tempfile.path)
          rescue => e
            next
          end
        end
        render json: {urls: urls}
      end

  end
end
